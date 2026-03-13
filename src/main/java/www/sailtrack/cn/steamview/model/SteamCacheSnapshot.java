package www.sailtrack.cn.steamview.model;

import java.util.List;

public record SteamCacheSnapshot(
    List<SteamGame> games,
    SteamStats stats,
    SteamPlayerInfo player,
    String lastUpdated,
    String ingestedBy
) {
}
