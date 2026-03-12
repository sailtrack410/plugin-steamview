package www.sailtrack.cn.steamview.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import run.halo.app.extension.ConfigMap;
import run.halo.app.extension.Metadata;
import run.halo.app.extension.ReactiveExtensionClient;
import www.sailtrack.cn.steamview.model.SteamCacheSnapshot;

@Slf4j
@Service
public class GameCacheService {

    private static final String PRIMARY_CACHE_RESOURCE_NAME = "pluginsteamview-game-cache";
    private static final String LEGACY_CACHE_RESOURCE_NAME = "game-cache";
    private static final String CACHE_DATA_KEY = "gamesData";

    private final ReactiveExtensionClient extensionClient;
    private final ObjectMapper objectMapper;

    public GameCacheService(ReactiveExtensionClient extensionClient) {
        this.extensionClient = extensionClient;
        this.objectMapper = new ObjectMapper();
    }

    public Mono<SteamCacheSnapshot> getCachedGames(int refreshInterval) {
        return fetchCacheConfigMap()
            .flatMap(this::readCacheData)
            .flatMap(data -> isExpired(data, refreshInterval) ? Mono.empty() : Mono.just(data))
            .onErrorResume(error -> {
                log.warn("读取缓存失败，回退到实时请求", error);
                return Mono.empty();
            });
    }

    public Mono<Void> saveCachedGames(SteamCacheSnapshot snapshot) {
        try {
            String jsonData = objectMapper.writeValueAsString(snapshot);
            Map<String, String> payload = Map.of(CACHE_DATA_KEY, jsonData);

            return extensionClient.fetch(ConfigMap.class, PRIMARY_CACHE_RESOURCE_NAME)
                .flatMap(configMap -> {
                    configMap.setData(payload);
                    return extensionClient.update(configMap);
                })
                .switchIfEmpty(Mono.defer(() -> {
                    ConfigMap configMap = new ConfigMap();
                    Metadata metadata = new Metadata();
                    metadata.setName(PRIMARY_CACHE_RESOURCE_NAME);
                    configMap.setMetadata(metadata);
                    configMap.setData(payload);
                    return extensionClient.create(configMap);
                }))
                .doOnSuccess(unused -> log.debug("Steam 游戏缓存已更新"))
                .then();
        } catch (Exception error) {
            log.error("序列化缓存数据失败", error);
            return Mono.error(error);
        }
    }

    public Mono<Void> clearCache() {
        return extensionClient.fetch(ConfigMap.class, PRIMARY_CACHE_RESOURCE_NAME)
            .flatMap(extensionClient::delete)
            .then(extensionClient.fetch(ConfigMap.class, LEGACY_CACHE_RESOURCE_NAME)
                .flatMap(extensionClient::delete)
                .then())
            .onErrorResume(error -> {
                log.warn("清理缓存时出现异常", error);
                return Mono.empty();
            });
    }

    private Mono<ConfigMap> fetchCacheConfigMap() {
        return extensionClient.fetch(ConfigMap.class, PRIMARY_CACHE_RESOURCE_NAME)
            .switchIfEmpty(extensionClient.fetch(ConfigMap.class, LEGACY_CACHE_RESOURCE_NAME));
    }

    private Mono<SteamCacheSnapshot> readCacheData(ConfigMap configMap) {
        if (configMap.getData() == null) {
            return Mono.empty();
        }

        String jsonData = configMap.getData().get(CACHE_DATA_KEY);
        if (jsonData == null || jsonData.isBlank()) {
            return Mono.empty();
        }

        try {
            SteamCacheSnapshot data = objectMapper.readValue(jsonData, SteamCacheSnapshot.class);
            return Mono.just(data);
        } catch (Exception error) {
            log.warn("解析缓存数据失败", error);
            return Mono.empty();
        }
    }

    private boolean isExpired(SteamCacheSnapshot data, int refreshInterval) {
        String timestamp = data.lastUpdated();
        if (timestamp == null || timestamp.isBlank()) {
            return true;
        }

        try {
            Instant lastUpdated = Instant.parse(timestamp);
            long hoursSinceUpdate = Duration.between(lastUpdated, Instant.now()).toHours();
            return hoursSinceUpdate >= refreshInterval;
        } catch (Exception error) {
            log.warn("解析缓存时间失败", error);
            return true;
        }
    }
}
