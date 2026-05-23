package www.sailtrack.cn.steamview.model;

public record SteamGame(
    String appId,
    String name,
    String coverUrl,
    long totalTime,
    long twoWeekTime,
    double totalPercent,
    double twoWeekPercent,
    String lastPlayed,
    long lastPlayedAt,
    boolean hidden,
    boolean active
) {

    public SteamGame withName(String localizedName) {
        return new SteamGame(
            appId,
            localizedName,
            coverUrl,
            totalTime,
            twoWeekTime,
            totalPercent,
            twoWeekPercent,
            lastPlayed,
            lastPlayedAt,
            hidden,
            active
        );
    }

    public SteamGame withHidden(boolean hiddenValue) {
        return new SteamGame(
            appId,
            name,
            coverUrl,
            totalTime,
            twoWeekTime,
            totalPercent,
            twoWeekPercent,
            lastPlayed,
            lastPlayedAt,
            hiddenValue,
            active
        );
    }

    public SteamGame withPercent(double totalPercentValue, double twoWeekPercentValue) {
        return new SteamGame(
            appId,
            name,
            coverUrl,
            totalTime,
            twoWeekTime,
            totalPercentValue,
            twoWeekPercentValue,
            lastPlayed,
            lastPlayedAt,
            hidden,
            active
        );
    }

    public SteamGame withCoverUrl(String newCoverUrl) {
        return new SteamGame(
            appId,
            name,
            newCoverUrl,
            totalTime,
            twoWeekTime,
            totalPercent,
            twoWeekPercent,
            lastPlayed,
            lastPlayedAt,
            hidden,
            active
        );
    }
}
