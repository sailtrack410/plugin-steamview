package www.sailtrack.cn.steamview.model;

public record SteamPlayerBadge(
    int badgeId,
    int level,
    long completionTime,
    int xp,
    int scarcity,
    Integer appId,
    String iconUrl
) {
    public SteamPlayerBadge {
        appId = appId == null ? 0 : appId;
        iconUrl = iconUrl == null ? "" : iconUrl.trim();
    }
}
