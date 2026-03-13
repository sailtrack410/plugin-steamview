package www.sailtrack.cn.steamview.model;

import java.util.List;

public record SteamPublicGamesResponse(
    List<SteamGame> games,
    SteamStats stats,
    SteamPlayerInfo player,
    String lastUpdated
) {
}
