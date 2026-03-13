package www.sailtrack.cn.steamview.model;

public record SteamRefreshResult(
    boolean success,
    String message,
    SteamCacheSnapshot data
) {
}
