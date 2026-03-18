package www.sailtrack.cn.steamview.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.function.UnaryOperator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import reactor.core.publisher.Mono;
import run.halo.app.extension.ConfigMap;
import run.halo.app.extension.Metadata;
import run.halo.app.extension.ReactiveExtensionClient;
import run.halo.app.plugin.ReactiveSettingFetcher;

@Slf4j
@Service
public class SteamViewConfigService {

    private static final String BASE_GROUP = "base";
    private static final String ADVANCED_GROUP = "advanced";
    private static final String CONFIG_MAP_NAME = "pluginsteamview-configmap";
    private static final String HIDDEN_GAMES_KEY = "hiddenGames";

    private static final String PROXY_DOMAIN_API_KEY = "proxyDomainApi";
    private static final String PROXY_DOMAIN_STORE_KEY = "proxyDomainStore";
    private static final String PROXY_DOMAIN_COMMUNITY_KEY = "proxyDomainCommunity";
    private static final String STEAM_API_BASE_KEY = "steamApiBase";
    private static final String STEAM_STORE_BASE_KEY = "steamStoreBase";

    private static final String DEFAULT_STEAM_API_BASE = "https://api.steampowered.com";
    private static final String DEFAULT_STEAM_STORE_BASE = "https://store.steampowered.com";
    private static final String DEFAULT_STEAM_COMMUNITY_BASE = "https://steamcommunity.com";
    private static final String DEFAULT_API_DOMAIN = "api.steampowered.com";
    private static final String DEFAULT_STORE_DOMAIN = "store.steampowered.com";
    private static final String DEFAULT_COMMUNITY_DOMAIN = "steamcommunity.com";
    private final ReactiveSettingFetcher settingFetcher;
    private final ReactiveExtensionClient extensionClient;
    private final ObjectMapper objectMapper;

    public SteamViewConfigService(ReactiveSettingFetcher settingFetcher,
                                  ReactiveExtensionClient extensionClient) {
        this.settingFetcher = settingFetcher;
        this.extensionClient = extensionClient;
        this.objectMapper = new ObjectMapper();
    }

    public Mono<String> getSteamApiKey() {
        return getSettingValue(BASE_GROUP, "steamApiKey");
    }

    public Mono<String> getSteamId() {
        return getSettingValue(BASE_GROUP, "steamId");
    }

    public Mono<Integer> getRefreshInterval() {
        return getIntegerSettingValue(BASE_GROUP, "refreshInterval", 24);
    }

    public Mono<String> getSteamApiBase() {
        return getSettingValue(BASE_GROUP, PROXY_DOMAIN_API_KEY)
            .flatMap(value -> {
                if (StringUtils.hasText(value)) {
                    String trimmed = value.trim();
                    // 支持完整 URL 格式（路径级代理）：https://proxy.example.com/path/https://api.steampowered.com
                    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
                        return Mono.just(normalizeFullUrl(trimmed, DEFAULT_STEAM_API_BASE));
                    }
                    // 域名格式：api.steampowered.com
                    String domain = normalizeDomain(trimmed, DEFAULT_API_DOMAIN);
                    return Mono.just("https://" + domain);
                }
                return getSettingValue(BASE_GROUP, STEAM_API_BASE_KEY)
                    .map(base -> normalizeBaseUrl(base, DEFAULT_STEAM_API_BASE));
            })
            .defaultIfEmpty(DEFAULT_STEAM_API_BASE);
    }

    public Mono<String> getSteamStoreBase() {
        return getSettingValue(BASE_GROUP, PROXY_DOMAIN_STORE_KEY)
            .flatMap(value -> {
                if (StringUtils.hasText(value)) {
                    String trimmed = value.trim();
                    // 支持完整 URL 格式（路径级代理）
                    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
                        return Mono.just(normalizeFullUrl(trimmed, DEFAULT_STEAM_STORE_BASE));
                    }
                    // 域名格式
                    String domain = normalizeDomain(trimmed, DEFAULT_STORE_DOMAIN);
                    return Mono.just("https://" + domain);
                }
                return getSettingValue(BASE_GROUP, STEAM_STORE_BASE_KEY)
                    .map(base -> normalizeBaseUrl(base, DEFAULT_STEAM_STORE_BASE));
            })
            .defaultIfEmpty(DEFAULT_STEAM_STORE_BASE);
    }

    public Mono<String> getSteamCommunityBase() {
        return getSettingValue(BASE_GROUP, PROXY_DOMAIN_COMMUNITY_KEY)
            .flatMap(value -> {
                if (StringUtils.hasText(value)) {
                    String trimmed = value.trim();
                    // 支持完整 URL 格式（路径级代理）
                    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
                        return Mono.just(normalizeFullUrl(trimmed, DEFAULT_STEAM_COMMUNITY_BASE));
                    }
                    // 域名格式
                    String domain = normalizeDomain(trimmed, DEFAULT_COMMUNITY_DOMAIN);
                    return Mono.just("https://" + domain);
                }
                return Mono.just(DEFAULT_STEAM_COMMUNITY_BASE);
            })
            .defaultIfEmpty(DEFAULT_STEAM_COMMUNITY_BASE);
    }

    public Mono<List<String>> getHiddenGames() {
        return getSettingValue(ADVANCED_GROUP, HIDDEN_GAMES_KEY)
            .flatMap(raw -> {
                List<String> parsed = parseHiddenGames(raw);
                if (!parsed.isEmpty()) {
                    return Mono.just(parsed);
                }
                return getSettingValue(BASE_GROUP, HIDDEN_GAMES_KEY)
                    .map(this::parseHiddenGames);
            })
            .defaultIfEmpty(List.of());
    }

    public Mono<List<String>> hideGame(String appId) {
        return mutateHiddenGames(normalizeAppId(appId), hiddenGames -> {
            hiddenGames.add(normalizeAppId(appId));
            return hiddenGames;
        });
    }

    public Mono<List<String>> unhideGame(String appId) {
        return mutateHiddenGames(normalizeAppId(appId), hiddenGames -> {
            hiddenGames.remove(normalizeAppId(appId));
            return hiddenGames;
        });
    }

    private Mono<List<String>> mutateHiddenGames(String appId,
                                                 UnaryOperator<LinkedHashSet<String>> mutator) {
        if (!StringUtils.hasText(appId)) {
            return Mono.just(List.of());
        }

        return extensionClient.fetch(ConfigMap.class, CONFIG_MAP_NAME)
            .flatMap(configMap -> saveHiddenGames(configMap, true, mutator))
            .switchIfEmpty(Mono.defer(() -> saveHiddenGames(createConfigMap(), false, mutator)));
    }

    private Mono<List<String>> saveHiddenGames(ConfigMap configMap,
                                               boolean exists,
                                               UnaryOperator<LinkedHashSet<String>> mutator) {
        try {
            Map<String, String> data = new HashMap<>();
            if (configMap.getData() != null) {
                data.putAll(configMap.getData());
            }

            ObjectNode advancedNode = readGroupNode(data.get(ADVANCED_GROUP));
            LinkedHashSet<String> hiddenGames = parseHiddenGamesNode(advancedNode.path(HIDDEN_GAMES_KEY));
            LinkedHashSet<String> updated = mutator.apply(hiddenGames);

            ArrayNode hiddenArray = objectMapper.valueToTree(updated);
            advancedNode.set(HIDDEN_GAMES_KEY, hiddenArray);
            data.put(ADVANCED_GROUP, objectMapper.writeValueAsString(advancedNode));
            configMap.setData(data);

            Mono<ConfigMap> operation = exists
                ? extensionClient.update(configMap)
                : extensionClient.create(configMap);

            return operation.thenReturn(List.copyOf(updated));
        } catch (Exception error) {
            log.error("更新隐藏游戏配置失败", error);
            return Mono.error(error);
        }
    }

    private ConfigMap createConfigMap() {
        ConfigMap configMap = new ConfigMap();
        Metadata metadata = new Metadata();
        metadata.setName(CONFIG_MAP_NAME);
        configMap.setMetadata(metadata);
        configMap.setData(new HashMap<>());
        return configMap;
    }

    private ObjectNode readGroupNode(String rawGroupData) {
        if (!StringUtils.hasText(rawGroupData)) {
            return objectMapper.createObjectNode();
        }

        try {
            JsonNode node = objectMapper.readTree(rawGroupData);
            if (node.isObject()) {
                return (ObjectNode) node.deepCopy();
            }
        } catch (Exception error) {
            log.warn("解析设置分组失败，使用空对象兜底", error);
        }

        return objectMapper.createObjectNode();
    }

    private LinkedHashSet<String> parseHiddenGamesNode(JsonNode node) {
        LinkedHashSet<String> hiddenGames = new LinkedHashSet<>();
        if (!node.isArray()) {
            return hiddenGames;
        }

        node.forEach(item -> {
            String appId = normalizeAppId(item.asText());
            if (StringUtils.hasText(appId)) {
                hiddenGames.add(appId);
            }
        });

        return hiddenGames;
    }

    private List<String> parseHiddenGames(String rawValue) {
        if (!StringUtils.hasText(rawValue)) {
            return List.of();
        }

        try {
            JsonNode node = objectMapper.readTree(rawValue);
            if (!node.isArray()) {
                return List.of();
            }

            List<String> hiddenGames = new ArrayList<>();
            node.forEach(item -> {
                String appId = normalizeAppId(item.asText());
                if (StringUtils.hasText(appId)) {
                    hiddenGames.add(appId);
                }
            });
            return hiddenGames;
        } catch (Exception error) {
            log.warn("解析 hiddenGames 失败，返回空列表", error);
            return List.of();
        }
    }

    private Mono<String> getSettingValue(String group, String key) {
        return settingFetcher.get(group)
            .map(groupValues -> {
                JsonNode valueNode = groupValues.path(key);
                if (valueNode.isMissingNode() || valueNode.isNull()) {
                    return "";
                }
                if (valueNode.isContainerNode()) {
                    try {
                        return objectMapper.writeValueAsString(valueNode);
                    } catch (Exception error) {
                        log.warn("序列化设置项失败: {}.{}", group, key, error);
                        return "";
                    }
                }
                return valueNode.asText("");
            })
            .defaultIfEmpty("");
    }

    private Mono<Integer> getIntegerSettingValue(String group, String key, int defaultValue) {
        return getSettingValue(group, key)
            .map(value -> {
                if (!StringUtils.hasText(value)) {
                    return defaultValue;
                }
                try {
                    return Integer.parseInt(value.trim());
                } catch (NumberFormatException error) {
                    log.warn("解析整数设置失败: {}.{}={}", group, key, value, error);
                    return defaultValue;
                }
            })
            .defaultIfEmpty(defaultValue);
    }

    private String normalizeAppId(String appId) {
        return appId == null ? "" : appId.trim();
    }

    private String normalizeBaseUrl(String value, String defaultValue) {
        if (!StringUtils.hasText(value)) {
            return defaultValue;
        }

        String normalized = value.trim();
        if (normalized.endsWith("/")) {
            normalized = normalized.substring(0, normalized.length() - 1);
        }

        if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
            return defaultValue;
        }

        return normalized;
    }

    private String normalizeFullUrl(String value, String defaultValue) {
        if (!StringUtils.hasText(value)) {
            return defaultValue;
        }

        String normalized = value.trim();
        if (normalized.endsWith("/")) {
            normalized = normalized.substring(0, normalized.length() - 1);
        }

        return normalized;
    }

    private String normalizeDomain(String value, String defaultValue) {
        if (!StringUtils.hasText(value)) {
            return defaultValue;
        }

        String normalized = value.trim().toLowerCase();
        if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
            try {
                URI uri = URI.create(normalized);
                normalized = uri.getHost();
            } catch (Exception ignored) {
                return defaultValue;
            }
        }

        if (normalized.startsWith("*.")) {
            normalized = normalized.substring(2);
        }

        int slashIndex = normalized.indexOf('/');
        if (slashIndex > -1) {
            normalized = normalized.substring(0, slashIndex);
        }

        int colonIndex = normalized.indexOf(':');
        if (colonIndex > -1) {
            normalized = normalized.substring(0, colonIndex);
        }

        return StringUtils.hasText(normalized) ? normalized : defaultValue;
    }
}
