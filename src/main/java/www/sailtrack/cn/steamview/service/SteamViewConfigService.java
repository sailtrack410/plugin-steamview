package www.sailtrack.cn.steamview.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
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

    private static final String PROXY_ENABLED_KEY = "proxyEnabled";
    private static final String PROXY_ADDRESS_KEY = "proxyAddress";
    private static final String PROXY_USERNAME_KEY = "proxyUsername";
    private static final String PROXY_PASSWORD_KEY = "proxyPassword";
    private static final String PROXY_DOMAINS_KEY = "proxyDomains";

    private static final List<String> DEFAULT_PROXY_DOMAINS = List.of(
        "api.steampowered.com",
        "store.steampowered.com",
        "steamcommunity.com"
    );

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

    public Mono<SteamProxyConfig> getSteamProxyConfig() {
        return Mono.zip(
                getBooleanSettingValue(BASE_GROUP, PROXY_ENABLED_KEY, false),
                getSettingValue(BASE_GROUP, PROXY_ADDRESS_KEY),
                getSettingValue(BASE_GROUP, PROXY_USERNAME_KEY),
                getSettingValue(BASE_GROUP, PROXY_PASSWORD_KEY),
                getSettingValue(BASE_GROUP, PROXY_DOMAINS_KEY)
            )
            .map(tuple -> new SteamProxyConfig(
                tuple.getT1(),
                tuple.getT2(),
                tuple.getT3(),
                tuple.getT4(),
                parseProxyDomains(tuple.getT5())
            ));
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

    private List<String> parseProxyDomains(String rawValue) {
        if (!StringUtils.hasText(rawValue)) {
            return DEFAULT_PROXY_DOMAINS;
        }

        String normalized = rawValue
            .replace("\n", ",")
            .replace(";", ",")
            .trim();

        String[] split = normalized.split(",");
        List<String> domains = new ArrayList<>();
        for (String item : split) {
            String domain = item.trim();
            if (StringUtils.hasText(domain)) {
                domains.add(domain);
            }
        }

        return domains.isEmpty() ? DEFAULT_PROXY_DOMAINS : domains;
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

    private Mono<Boolean> getBooleanSettingValue(String group, String key, boolean defaultValue) {
        return getSettingValue(group, key)
            .map(value -> {
                if (!StringUtils.hasText(value)) {
                    return defaultValue;
                }
                return Boolean.parseBoolean(value.trim());
            })
            .defaultIfEmpty(defaultValue);
    }

    private String normalizeAppId(String appId) {
        return appId == null ? "" : appId.trim();
    }
}
