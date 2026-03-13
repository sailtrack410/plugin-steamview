package www.sailtrack.cn.steamview.model;

public record SteamStats(
    int totalGames,
    long totalTime,
    long twoWeekTime,
    long activeGames
) {
}
