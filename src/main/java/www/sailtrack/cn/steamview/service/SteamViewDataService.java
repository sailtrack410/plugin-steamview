package www.sailtrack.cn.steamview.service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import www.sailtrack.cn.steamview.model.SteamCacheSnapshot;
import www.sailtrack.cn.steamview.model.SteamConnectionResult;
import www.sailtrack.cn.steamview.model.SteamConsoleGamesResponse;
import www.sailtrack.cn.steamview.model.SteamGame;
import www.sailtrack.cn.steamview.model.SteamPlayerInfo;
import www.sailtrack.cn.steamview.model.SteamPublicGamesResponse;
import www.sailtrack.cn.steamview.model.SteamRawGame;
import www.sailtrack.cn.steamview.model.SteamStats;
import www.sailtrack.cn.steamview.model.SteamSummary;
import www.sailtrack.cn.steamview.query.SteamConsoleQuery;

@Slf4j
@Service
@RequiredArgsConstructor
public class SteamViewDataService {

    private static final int LOCALIZATION_CONCURRENCY = 4;
    public static final String SYSTEM_INGESTED_BY = "system";

    private final SteamApiService steamApiService;
    private final SteamViewConfigService configService;
    private final GameCacheService gameCacheService;

    public Mono<SteamPublicGamesResponse> getPublicGames() {
        return getCachedOrFetchData(SYSTEM_INGESTED_BY)
            .flatMap(data -> configService.getHiddenGames()
                .map(hiddenGames -> toPublicResult(data, Set.copyOf(hiddenGames))));
    }

    public Mono<SteamConsoleGamesResponse> listConsoleGames(SteamConsoleQuery query, String ingestedBy) {
        return getCachedOrFetchData(ingestedBy)
            .flatMap(data -> configService.getHiddenGames()
                .map(hiddenGames -> toConsoleResult(data, Set.copyOf(hiddenGames), query)));
    }

    public Mono<SteamCacheSnapshot> refreshGames(String ingestedBy) {
        return fetchFromSteamApi(ingestedBy);
    }

    public Mono<SteamConnectionResult> testConnection() {
        return requiredSetting(configService.getSteamApiKey(), "Steam API Key 未配置")
            .zipWith(requiredSetting(configService.getSteamId(), "Steam ID 未配置"))
            .flatMap(tuple -> steamApiService.getOwnedGames(tuple.getT1(), tuple.getT2())
                .map(games -> new SteamConnectionResult(
                    true,
                    "连接成功，找到 " + games.size() + " 个游戏",
                    games.size()
                )))
            .onErrorResume(error -> Mono.just(new SteamConnectionResult(false, error.getMessage(), null)));
    }

    private Mono<SteamCacheSnapshot> getCachedOrFetchData(String ingestedBy) {
        return configService.getRefreshInterval()
            .flatMap(refreshInterval -> gameCacheService.getCachedGames(refreshInterval)
                .switchIfEmpty(fetchFromSteamApi(ingestedBy)));
    }

    private Mono<SteamCacheSnapshot> fetchFromSteamApi(String ingestedBy) {
        String actualIngestedBy = normalizeIngestedBy(ingestedBy);
        return requiredSetting(configService.getSteamApiKey(), "Steam API Key 未配置")
            .zipWith(requiredSetting(configService.getSteamId(), "Steam ID 未配置"))
            .flatMap(tuple -> Mono.zip(
                steamApiService.getOwnedGames(tuple.getT1(), tuple.getT2()),
                steamApiService.getRecentlyPlayedGames(tuple.getT1(), tuple.getT2()),
                steamApiService.getPlayerInfo(tuple.getT1(), tuple.getT2())
            ))
            .flatMap(tuple -> {
                List<SteamRawGame> mergedGames = mergeSteamGames(tuple.getT1(), tuple.getT2());
                SteamPlayerInfo playerInfo = normalizePlayerInfo(tuple.getT3());
                return processRawGames(mergedGames)
                    .flatMap(processed -> {
                        List<SteamGame> normalized = recalculatePercentages(processed);
                        SteamCacheSnapshot snapshot = new SteamCacheSnapshot(
                            normalized,
                            buildStats(normalized),
                            playerInfo,
                            Instant.now().toString(),
                            actualIngestedBy
                        );
                        return gameCacheService.saveCachedGames(snapshot).thenReturn(snapshot);
                    });
            })
            .doOnError(error -> log.error("从 Steam API 获取数据失败", error));
    }

    private Mono<String> requiredSetting(Mono<String> source, String errorMessage) {
        return source
            .map(value -> value == null ? "" : value.trim())
            .flatMap(value -> StringUtils.hasText(value)
                ? Mono.just(value)
                : Mono.error(new IllegalStateException(errorMessage)));
    }

    private List<SteamRawGame> mergeSteamGames(List<SteamRawGame> owned, List<SteamRawGame> recent) {
        Map<String, SteamRawGame> merged = new LinkedHashMap<>();
        owned.forEach(game -> merged.put(game.appId(), game));
        recent.forEach(game -> merged.putIfAbsent(game.appId(), game));
        return new ArrayList<>(merged.values());
    }

    private Mono<List<SteamGame>> processRawGames(List<SteamRawGame> rawGames) {
        List<SteamGame> normalized = rawGames.stream()
            .map(this::toGameModel)
            .toList();

        return Flux.fromIterable(normalized)
            .flatMap(this::localizeGameName, LOCALIZATION_CONCURRENCY)
            .collectList();
    }

    private Mono<SteamGame> localizeGameName(SteamGame game) {
        return steamApiService.getLocalizedGameName(game.appId())
            .map(localizedName -> StringUtils.hasText(localizedName)
                ? game.withName(localizedName)
                : game)
            .onErrorReturn(game);
    }

    private SteamGame toGameModel(SteamRawGame rawGame) {
        long twoWeekTime = rawGame.playtime2weeks();
        long lastPlayedEpoch = rawGame.rtimeLastPlayed();
        return new SteamGame(
            rawGame.appId(),
            rawGame.name(),
            steamApiService.getGameCoverUrl(rawGame.appId()),
            rawGame.playtimeForever(),
            twoWeekTime,
            0,
            0,
            formatLastPlayed(lastPlayedEpoch),
            lastPlayedEpoch,
            false,
            twoWeekTime > 0
        );
    }

    private String formatLastPlayed(long lastPlayedEpoch) {
        if (lastPlayedEpoch <= 0) {
            return "从未游玩";
        }
        ZonedDateTime dateTime = ZonedDateTime.ofInstant(Instant.ofEpochSecond(lastPlayedEpoch),
            ZoneId.systemDefault());
        return dateTime.toLocalDate().toString();
    }

    private SteamPublicGamesResponse toPublicResult(SteamCacheSnapshot source, Set<String> hiddenGames) {
        List<SteamGame> visibleGames = decorateHidden(source.games(), hiddenGames).stream()
            .filter(game -> !game.hidden())
            .sorted(bySort("twoWeekTime"))
            .toList();

        List<SteamGame> withPercent = recalculatePercentages(visibleGames);
        return new SteamPublicGamesResponse(
            withPercent,
            buildStats(withPercent),
            normalizePlayerInfo(source.player()),
            source.lastUpdated()
        );
    }

    private SteamConsoleGamesResponse toConsoleResult(SteamCacheSnapshot source,
                                                      Set<String> hiddenGames,
                                                      SteamConsoleQuery query) {
        List<SteamGame> allGames = decorateHidden(source.games(), hiddenGames);

        List<SteamGame> filteredGames = allGames.stream()
            .filter(game -> keywordMatched(game, query.getKeyword()))
            .filter(game -> hiddenMatched(game, query.getHidden()))
            .filter(game -> activityMatched(game, query.getActivity()))
            .sorted(bySort(query.getSort()))
            .toList();

        List<SteamGame> withPercent = recalculatePercentages(filteredGames);

        int total = withPercent.size();
        int fromIndex = Math.max(0, (query.getPage() - 1) * query.getSize());
        int toIndex = Math.min(total, fromIndex + query.getSize());
        List<SteamGame> items = fromIndex >= total
            ? List.of()
            : withPercent.subList(fromIndex, toIndex);

        long hiddenCount = allGames.stream().filter(SteamGame::hidden).count();

        return new SteamConsoleGamesResponse(
            items,
            query.getPage(),
            query.getSize(),
            total,
            buildStats(withPercent),
            new SteamSummary(allGames.size(), hiddenCount, allGames.size() - hiddenCount),
            source.lastUpdated(),
            normalizeIngestedBy(source.ingestedBy()),
            normalizePlayerInfo(source.player())
        );
    }

    private String normalizeIngestedBy(String ingestedBy) {
        return StringUtils.hasText(ingestedBy) ? ingestedBy.trim() : SYSTEM_INGESTED_BY;
    }

    private SteamPlayerInfo normalizePlayerInfo(SteamPlayerInfo playerInfo) {
        return playerInfo == null ? SteamPlayerInfo.empty("") : playerInfo;
    }

    private List<SteamGame> decorateHidden(List<SteamGame> games, Set<String> hiddenGames) {
        return games.stream()
            .map(game -> game.withHidden(hiddenGames.contains(game.appId())))
            .toList();
    }

    private List<SteamGame> recalculatePercentages(List<SteamGame> games) {
        long totalTime = games.stream().mapToLong(SteamGame::totalTime).sum();
        long totalTwoWeekTime = games.stream().mapToLong(SteamGame::twoWeekTime).sum();

        return games.stream()
            .map(game -> {
                double totalPercent = totalTime > 0 ? game.totalTime() * 100D / totalTime : 0D;
                double twoWeekPercent = totalTwoWeekTime > 0
                    ? game.twoWeekTime() * 100D / totalTwoWeekTime
                    : 0D;
                return game.withPercent(totalPercent, twoWeekPercent);
            })
            .toList();
    }

    private SteamStats buildStats(List<SteamGame> games) {
        long totalTime = games.stream().mapToLong(SteamGame::totalTime).sum();
        long twoWeekTime = games.stream().mapToLong(SteamGame::twoWeekTime).sum();
        long activeGames = games.stream().filter(game -> game.twoWeekTime() > 0).count();
        return new SteamStats(games.size(), totalTime, twoWeekTime, activeGames);
    }

    private boolean keywordMatched(SteamGame game, String keyword) {
        if (!StringUtils.hasText(keyword)) {
            return true;
        }
        String lowerKeyword = keyword.toLowerCase();
        return game.name().toLowerCase().contains(lowerKeyword)
            || game.appId().toLowerCase().contains(lowerKeyword);
    }

    private boolean hiddenMatched(SteamGame game, String hiddenFilter) {
        return switch (hiddenFilter) {
            case "hidden" -> game.hidden();
            case "visible" -> !game.hidden();
            default -> true;
        };
    }

    private boolean activityMatched(SteamGame game, String activityFilter) {
        return switch (activityFilter) {
            case "active" -> game.twoWeekTime() > 0;
            case "inactive" -> game.twoWeekTime() <= 0;
            default -> true;
        };
    }

    private Comparator<SteamGame> bySort(String sort) {
        return switch (sort) {
            case "totalTime" -> Comparator.comparingLong(SteamGame::totalTime).reversed();
            case "name" -> Comparator.comparing(SteamGame::name, String.CASE_INSENSITIVE_ORDER);
            case "lastPlayed" -> Comparator.comparingLong(SteamGame::lastPlayedAt).reversed();
            default -> Comparator.comparingLong(SteamGame::twoWeekTime).reversed();
        };
    }
}
