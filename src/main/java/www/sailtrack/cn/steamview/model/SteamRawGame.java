package www.sailtrack.cn.steamview.model;

public record SteamRawGame(
    String appId,
    String name,
    long playtimeForever,
    long playtime2weeks,
    long rtimeLastPlayed
) {
}
