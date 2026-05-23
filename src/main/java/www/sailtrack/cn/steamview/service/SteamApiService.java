package www.sailtrack.cn.steamview.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.netty.channel.ChannelOption;
import java.io.IOException;
import java.net.URI;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;
import reactor.util.retry.Retry;
import www.sailtrack.cn.steamview.model.SteamPlayerBadge;
import www.sailtrack.cn.steamview.model.SteamPlayerInfo;
import www.sailtrack.cn.steamview.model.SteamRawGame;

@Slf4j
@Service
public class SteamApiService {

    private static final String FASTLY_COMMUNITY_CDN = "https://community.fastly.steamstatic.com";
    private static final Pattern GAME_CARDS_APP_ID_PATTERN = Pattern.compile("/gamecards/(\\d+)");
    private static final Pattern BADGE_ID_PATTERN = Pattern.compile("/badges/(\\d+)");
    private static final Pattern ITEMS_APP_ID_PATTERN = Pattern.compile("/public/images/items/(\\d+)/");

    private final SteamViewConfigService configService;
    private final ObjectMapper objectMapper;
    private final WebClient directClient;

    public SteamApiService(SteamViewConfigService configService) {
        this.configService = configService;
        this.objectMapper = new ObjectMapper();
        this.directClient = buildWebClient(baseHttpClient());
    }

    public Mono<String> getSteamId(String apiKey, String username) {
        String path = String.format(
            "/ISteamUser/ResolveVanityURL/v0001/?key=%s&vanityurl=%s",
            apiKey,
            username
        );

        return steamApiUrl(path)
            .flatMap(this::getResponse)
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
        String path = String.format(
            "/IPlayerService/GetOwnedGames/v0001/?key=%s&steamid=%s&format=json&include_appinfo=true&include_played_free_games=true",
            apiKey,
            steamId
        );

        return steamApiUrl(path)
            .flatMap(this::getResponse)
            .map(response -> parseGames(response, "games response"));
    }

    public String getGameCoverUrl(String appId) {
        return String.format("https://cdn.cloudflare.steamstatic.com/steam/apps/%s/header.jpg", appId);
    }

    public Mono<String> resolveCoverUrl(String appId) {
        return configService.getSteamCoverMirror()
            .map(mirror -> configService.resolveMirrorUrl(getGameCoverUrl(appId), mirror))
            .defaultIfEmpty(getGameCoverUrl(appId));
    }

    public Mono<SteamPlayerInfo> resolveAvatarUrls(SteamPlayerInfo playerInfo) {
        if (playerInfo == null || !StringUtils.hasText(playerInfo.avatar())) {
            return Mono.justOrEmpty(playerInfo);
        }
        return configService.getSteamAvatarMirror()
            .map(mirror -> new SteamPlayerInfo(
                playerInfo.steamId(),
                playerInfo.personaName(),
                playerInfo.profileUrl(),
                configService.resolveMirrorUrl(playerInfo.avatar(), mirror),
                configService.resolveMirrorUrl(playerInfo.avatarMedium(), mirror),
                configService.resolveMirrorUrl(playerInfo.avatarFull(), mirror),
                playerInfo.level(),
                playerInfo.badgeCount(),
                playerInfo.playerXp(),
                playerInfo.xpToNextLevel(),
                playerInfo.badges()
            ))
            .defaultIfEmpty(playerInfo);
    }

    public Mono<List<SteamRawGame>> getRecentlyPlayedGames(String apiKey, String steamId) {
        String path = String.format(
            "/IPlayerService/GetRecentlyPlayedGames/v0001/?key=%s&steamid=%s&format=json",
            apiKey,
            steamId
        );

        return steamApiUrl(path)
            .flatMap(this::getResponse)
            .map(response -> parseGames(response, "recently played games response"));
    }

    public Mono<SteamPlayerInfo> getPlayerInfo(String apiKey, String steamId) {
        return configService.getSteamApiBase()
            .flatMap(apiBase -> {
                String profileUrl = String.format(
                    "%s/ISteamUser/GetPlayerSummaries/v0002/?key=%s&steamids=%s",
                    apiBase,
                    apiKey,
                    steamId
                );
                String levelUrl = String.format(
                    "%s/IPlayerService/GetSteamLevel/v1/?key=%s&steamid=%s",
                    apiBase,
                    apiKey,
                    steamId
                );
                String badgesUrl = String.format(
                    "%s/IPlayerService/GetBadges/v1/?key=%s&steamid=%s",
                    apiBase,
                    apiKey,
                    steamId
                );

                Mono<SteamPlayerInfo> profileMono = getResponse(profileUrl)
                    .map(response -> parsePlayerProfile(response, steamId))
                    .onErrorReturn(SteamPlayerInfo.empty(steamId));

                Mono<Integer> levelMono = getResponse(levelUrl)
                    .map(this::parsePlayerLevel)
                    .onErrorReturn(0);

                Mono<PlayerBadgesPayload> badgesMono = getResponse(badgesUrl)
                    .map(this::parsePlayerBadges)
                    .onErrorReturn(PlayerBadgesPayload.empty());

                Mono<BadgeIconMaps> badgeIconMapsMono = getBadgeIconMaps(steamId)
                    .onErrorReturn(BadgeIconMaps.empty());

                return Mono.zip(profileMono, levelMono, badgesMono, badgeIconMapsMono)
                    .map(tuple -> {
                        SteamPlayerInfo profile = tuple.getT1();
                        PlayerBadgesPayload payload = tuple.getT3();
                        int level = tuple.getT2() > 0 ? tuple.getT2() : payload.playerLevel();
                        List<SteamPlayerBadge> badges = applyBadgeIcons(payload.badges(), tuple.getT4());
                        return new SteamPlayerInfo(
                            profile.steamId(),
                            profile.personaName(),
                            profile.profileUrl(),
                            profile.avatar(),
                            profile.avatarMedium(),
                            profile.avatarFull(),
                            level,
                            badges.size(),
                            payload.playerXp(),
                            payload.xpToNextLevel(),
                            badges
                        );
                    });
            })
            .onErrorResume(error -> {
                log.warn("获取 Steam 玩家资料失败: {}", reason(error));
                return Mono.just(SteamPlayerInfo.empty(steamId));
            });
    }

    public Mono<String> getLocalizedGameName(String appId) {
        String path = String.format(
            "/api/appdetails?appids=%s&l=schinese",
            appId
        );

        return steamStoreUrl(path)
            .flatMap(this::getResponse)
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

    private Mono<String> steamApiUrl(String path) {
        return configService.getSteamApiBase()
            .map(base -> base + path);
    }

    private Mono<String> steamStoreUrl(String path) {
        return configService.getSteamStoreBase()
            .map(base -> base + path);
    }

    private Mono<String> steamCommunityUrl(String path) {
        return configService.getSteamCommunityBase()
            .map(base -> base + path);
    }

    private Mono<String> getResponse(String url) {
        return directClient.get()
            .uri(url)
            .retrieve()
            .bodyToMono(String.class);
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

    private SteamPlayerInfo parsePlayerProfile(String response, String steamId) {
        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode players = root.path("response").path("players");
            if (!players.isArray() || players.size() == 0) {
                return SteamPlayerInfo.empty(steamId);
            }

            JsonNode player = players.get(0);
            String resolvedSteamId = player.path("steamid").asText(steamId);
            return new SteamPlayerInfo(
                resolvedSteamId,
                player.path("personaname").asText(""),
                player.path("profileurl").asText(""),
                player.path("avatar").asText(""),
                player.path("avatarmedium").asText(""),
                player.path("avatarfull").asText(""),
                0,
                0,
                0L,
                null,
                List.of()
            );
        } catch (Exception error) {
            throw new IllegalStateException("Failed to parse player profile response", error);
        }
    }

    private int parsePlayerLevel(String response) {
        try {
            JsonNode root = objectMapper.readTree(response);
            return root.path("response").path("player_level").asInt(0);
        } catch (Exception error) {
            throw new IllegalStateException("Failed to parse player level response", error);
        }
    }

    private PlayerBadgesPayload parsePlayerBadges(String response) {
        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode responseNode = root.path("response");
            JsonNode badgesNode = responseNode.path("badges");

            List<SteamPlayerBadge> badges = new ArrayList<>();
            if (badgesNode.isArray()) {
                for (JsonNode badgeNode : badgesNode) {
                    badges.add(new SteamPlayerBadge(
                        badgeNode.path("badgeid").asInt(0),
                        badgeNode.path("level").asInt(0),
                        badgeNode.path("completion_time").asLong(0L),
                        badgeNode.path("xp").asInt(0),
                        badgeNode.path("scarcity").asInt(0),
                        badgeNode.path("appid").asInt(0),
                        ""
                    ));
                }
            }

            Integer xpToNextLevel = responseNode.has("player_xp_needed_to_level_up")
                ? responseNode.path("player_xp_needed_to_level_up").asInt(0)
                : null;

            return new PlayerBadgesPayload(
                badges,
                responseNode.path("player_xp").asLong(0L),
                xpToNextLevel,
                responseNode.path("player_level").asInt(0)
            );
        } catch (Exception error) {
            throw new IllegalStateException("Failed to parse player badges response", error);
        }
    }

    private Mono<BadgeIconMaps> getBadgeIconMaps(String steamId) {
        String path = String.format("/profiles/%s/badges/?l=english", steamId);
        return steamCommunityUrl(path)
            .flatMap(this::getResponse)
            .map(this::parseBadgeIconMaps)
            .onErrorResume(error -> {
                log.debug("抓取徽章图标失败: {}", reason(error));
                return Mono.just(BadgeIconMaps.empty());
            });
    }

    private BadgeIconMaps parseBadgeIconMaps(String html) {
        Map<Integer, String> appBadgeIcons = new LinkedHashMap<>();
        Map<Integer, String> standardBadgeIcons = new LinkedHashMap<>();

        for (Element row : Jsoup.parse(html).select(".badge_row")) {
            String iconUrl = extractBadgeIconUrl(row);
            if (!StringUtils.hasText(iconUrl)) {
                continue;
            }

            Integer appId = extractAppId(row, iconUrl);
            if (appId != null && appId > 0) {
                appBadgeIcons.putIfAbsent(appId, iconUrl);
            }

            Integer badgeId = extractBadgeId(row);
            if (badgeId != null && badgeId > 0) {
                standardBadgeIcons.putIfAbsent(badgeId, iconUrl);
            }
        }

        return new BadgeIconMaps(Map.copyOf(appBadgeIcons), Map.copyOf(standardBadgeIcons));
    }

    private List<SteamPlayerBadge> applyBadgeIcons(List<SteamPlayerBadge> badges, BadgeIconMaps iconMaps) {
        if (badges.isEmpty()) {
            return badges;
        }

        return badges.stream()
            .map(badge -> {
                String iconUrl = "";
                if (badge.appId() != null && badge.appId() > 0) {
                    iconUrl = iconMaps.appBadgeIcons().getOrDefault(badge.appId(), "");
                }
                if (!StringUtils.hasText(iconUrl)) {
                    iconUrl = iconMaps.standardBadgeIcons().getOrDefault(badge.badgeId(), "");
                }
                return new SteamPlayerBadge(
                    badge.badgeId(),
                    badge.level(),
                    badge.completionTime(),
                    badge.xp(),
                    badge.scarcity(),
                    badge.appId(),
                    iconUrl
                );
            })
            .toList();
    }

    private Integer extractAppId(Element row, String iconUrl) {
        for (Element link : row.select("a[href]")) {
            Integer appId = extractFirstInt(GAME_CARDS_APP_ID_PATTERN, link.attr("href"));
            if (appId != null) {
                return appId;
            }
        }
        return extractFirstInt(ITEMS_APP_ID_PATTERN, iconUrl);
    }

    private Integer extractBadgeId(Element row) {
        for (Element link : row.select("a[href]")) {
            Integer badgeId = extractFirstInt(BADGE_ID_PATTERN, link.attr("href"));
            if (badgeId != null) {
                return badgeId;
            }
        }
        return null;
    }

    private String extractBadgeIconUrl(Element row) {
        for (Element image : row.select("img[src]")) {
            String src = image.attr("src");
            if (!StringUtils.hasText(src)) {
                continue;
            }
            if (src.contains("/public/images/badges/") || src.contains("/public/images/items/")) {
                return normalizeBadgeIconUrl(src);
            }
        }
        return "";
    }

    private String normalizeBadgeIconUrl(String sourceUrl) {
        if (!StringUtils.hasText(sourceUrl)) {
            return "";
        }

        String normalized = sourceUrl.trim();
        if (normalized.startsWith("//")) {
            normalized = "https:" + normalized;
        } else if (normalized.startsWith("http://")) {
            normalized = "https://" + normalized.substring("http://".length());
        }

        try {
            URI uri = URI.create(normalized);
            String path = uri.getRawPath();
            if (!StringUtils.hasText(path)) {
                return normalized;
            }

            String query = StringUtils.hasText(uri.getRawQuery()) ? "?" + uri.getRawQuery() : "";
            if (path.startsWith("/public/images/")) {
                return FASTLY_COMMUNITY_CDN + path + query;
            }
            return normalized;
        } catch (Exception ignored) {
            return normalized;
        }
    }

    private Integer extractFirstInt(Pattern pattern, String source) {
        if (!StringUtils.hasText(source)) {
            return null;
        }
        Matcher matcher = pattern.matcher(source);
        if (!matcher.find()) {
            return null;
        }
        try {
            return Integer.parseInt(matcher.group(1));
        } catch (Exception ignored) {
            return null;
        }
    }

    private record PlayerBadgesPayload(
        List<SteamPlayerBadge> badges,
        long playerXp,
        Integer xpToNextLevel,
        int playerLevel
    ) {
        static PlayerBadgesPayload empty() {
            return new PlayerBadgesPayload(List.of(), 0L, null, 0);
        }
    }

    private record BadgeIconMaps(
        Map<Integer, String> appBadgeIcons,
        Map<Integer, String> standardBadgeIcons
    ) {
        static BadgeIconMaps empty() {
            return new BadgeIconMaps(Map.of(), Map.of());
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
