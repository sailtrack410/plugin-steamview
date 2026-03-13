package www.sailtrack.cn.steamview.model;

import java.util.List;

public record SteamPlayerInfo(
    String steamId,
    String personaName,
    String profileUrl,
    String avatar,
    String avatarMedium,
    String avatarFull,
    int level,
    int badgeCount,
    long playerXp,
    Integer xpToNextLevel,
    List<SteamPlayerBadge> badges
) {
    public SteamPlayerInfo {
        steamId = steamId == null ? "" : steamId;
        personaName = personaName == null ? "" : personaName;
        profileUrl = profileUrl == null ? "" : profileUrl;
        avatar = avatar == null ? "" : avatar;
        avatarMedium = avatarMedium == null ? "" : avatarMedium;
        avatarFull = avatarFull == null ? "" : avatarFull;
        badges = badges == null ? List.of() : List.copyOf(badges);
    }

    public static SteamPlayerInfo empty(String steamId) {
        return new SteamPlayerInfo(
            steamId,
            "",
            "",
            "",
            "",
            "",
            0,
            0,
            0L,
            null,
            List.of()
        );
    }
}
