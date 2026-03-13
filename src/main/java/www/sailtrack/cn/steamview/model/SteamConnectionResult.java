package www.sailtrack.cn.steamview.model;

public record SteamConnectionResult(
    boolean success,
    String message,
    Integer gameCount
) {
}
