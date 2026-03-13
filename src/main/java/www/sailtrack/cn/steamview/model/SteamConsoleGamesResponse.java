package www.sailtrack.cn.steamview.model;

import java.util.List;

public record SteamConsoleGamesResponse(
    List<SteamGame> items,
    int page,
    int size,
    int total,
    SteamStats stats,
    SteamSummary summary,
    String lastUpdated,
    String ingestedBy,
    SteamPlayerInfo player
) {
}
