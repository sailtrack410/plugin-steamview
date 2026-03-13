package www.sailtrack.cn.steamview.model;

import java.util.List;

public record SteamHiddenGamesResult(
    boolean success,
    String message,
    List<String> hiddenGames
) {
}
