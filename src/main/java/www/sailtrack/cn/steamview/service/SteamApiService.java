package www.sailtrack.cn.steamview.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.netty.channel.ChannelOption;
import java.io.IOException;
import java.net.URI;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;
import reactor.netty.transport.ProxyProvider;
import reactor.util.retry.Retry;
import www.sailtrack.cn.steamview.model.SteamRawGame;

@Slf4j
@Service
public class SteamApiService {

    private final SteamViewConfigService configService;
    private final ObjectMapper objectMapper;
    private final WebClient directClient;
    private final ConcurrentMap<String, WebClient> proxyClientCache;

    public SteamApiService(SteamViewConfigService configService) {
        this.configService = configService;
        this.objectMapper = new ObjectMapper();
        this.directClient = buildWebClient(baseHttpClient());
        this.proxyClientCache = new ConcurrentHashMap<>();
    }

    public Mono<String> getSteamId(String apiKey, String username) {
        String url = String.format(
            "https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=%s&vanityurl=%s",
            apiKey,
            username
        );

        return getResponse(url)
            .map(response -> {
                try {
                    JsonNode root = objectMapper.readTree(response);
                    JsonNode responseNode = root.path("response");
                    int success = responseNode.path("success").asInt();
                    if (success == 1) {
                        return responseNode.path("steamid").asText();
                    }
                    String message = responseNode.path("message").asText("Unknown error");
                    throw new IllegalStateException("Failed to resolve Steam ID: " + message);
                } catch (Exception error) {
                    throw new IllegalStateException("Failed to parse Steam ID response", error);
                }
            });
    }

    public Mono<List<SteamRawGame>> getOwnedGames(String apiKey, String steamId) {
        String url = String.format(
            "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=%s&steamid=%s&format=json&include_appinfo=true&include_played_free_games=true",
            apiKey,
            steamId
        );

        return getResponse(url)
            .map(response -> parseGames(response, "games response"));
    }

    public String getGameCoverUrl(String appId) {
        return String.format("https://cdn.cloudflare.steamstatic.com/steam/apps/%s/header.jpg", appId);
    }

    public Mono<List<SteamRawGame>> getRecentlyPlayedGames(String apiKey, String steamId) {
        String url = String.format(
            "https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=%s&steamid=%s&format=json",
            apiKey,
            steamId
        );

        return getResponse(url)
            .map(response -> parseGames(response, "recently played games response"));
    }

    public Mono<String> getLocalizedGameName(String appId) {
        String url = String.format(
            "https://store.steampowered.com/api/appdetails?appids=%s&l=schinese",
            appId
        );

        return getResponse(url)
            .retryWhen(Retry.backoff(1, Duration.ofMillis(200)).filter(this::isTransientNetworkError))
            .map(response -> {
                try {
                    JsonNode root = objectMapper.readTree(response);
                    JsonNode appNode = root.path(appId);
                    if (!appNode.has("success") || !appNode.path("success").asBoolean()) {
                        return null;
                    }
                    String name = appNode.path("data").path("name").asText();
                    return StringUtils.hasText(name) ? name : null;
                } catch (Exception error) {
                    log.debug("解析游戏 {} 本地化名称失败", appId, error);
                    return null;
                }
            })
            .onErrorResume(error -> {
                log.warn("获取游戏 {} 的本地化名称失败: {}", appId, reason(error));
                return Mono.just(null);
            });
    }

    private Mono<String> getResponse(String url) {
        return configService.getSteamProxyConfig()
            .flatMap(proxyConfig -> {
                WebClient client = resolveClient(url, proxyConfig);
                return client.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(String.class);
            });
    }

    private WebClient resolveClient(String url, SteamProxyConfig proxyConfig) {
        String targetHost = parseHost(url);
        if (proxyConfig.shouldProxyHost(targetHost)) {
            return proxyClientCache.computeIfAbsent(
                proxyConfig.cacheKey(),
                key -> buildProxyClient(proxyConfig)
            );
        }
        return directClient;
    }

    private WebClient buildProxyClient(SteamProxyConfig proxyConfig) {
        HttpClient proxied = baseHttpClient().proxy(spec -> {
            ProxyProvider.Builder builder = spec.type(proxyConfig.proxyType())
                .host(proxyConfig.host())
                .port(proxyConfig.port());
            if (StringUtils.hasText(proxyConfig.username())) {
                builder.username(proxyConfig.username());
                if (StringUtils.hasText(proxyConfig.password())) {
                    builder.password(unused -> proxyConfig.password());
                }
            }
        });

        log.info("Steam API 启用代理客户端: {}", proxyConfig.debugSummary());
        return buildWebClient(proxied);
    }

    private HttpClient baseHttpClient() {
        return HttpClient.create()
            .responseTimeout(Duration.ofSeconds(30))
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 10000);
    }

    private WebClient buildWebClient(HttpClient httpClient) {
        return WebClient.builder()
            .clientConnector(new ReactorClientHttpConnector(httpClient))
            .build();
    }

    private String parseHost(String url) {
        try {
            URI uri = URI.create(url);
            return uri.getHost() == null ? "" : uri.getHost();
        } catch (Exception ignored) {
            return "";
        }
    }

    private List<SteamRawGame> parseGames(String response, String context) {
        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode responseNode = root.path("response");
            JsonNode gamesNode = responseNode.path("games");

            List<SteamRawGame> games = new ArrayList<>();
            for (JsonNode gameNode : gamesNode) {
                games.add(new SteamRawGame(
                    gameNode.path("appid").asText(),
                    gameNode.path("name").asText(),
                    gameNode.path("playtime_forever").asLong(),
                    gameNode.path("playtime_2weeks").asLong(),
                    gameNode.path("rtime_last_played").asLong()
                ));
            }

            return games;
        } catch (Exception error) {
            throw new IllegalStateException("Failed to parse " + context, error);
        }
    }

    private boolean isTransientNetworkError(Throwable error) {
        Throwable cursor = error;
        while (cursor != null) {
            if (cursor instanceof IOException) {
                return true;
            }
            cursor = cursor.getCause();
        }
        return false;
    }

    private String reason(Throwable error) {
        String message = error.getMessage();
        if (StringUtils.hasText(message)) {
            return message;
        }
        return error.getClass().getSimpleName();
    }
}
