package www.sailtrack.cn.steamview.query;

import static org.springdoc.core.fn.builders.parameter.Builder.parameterBuilder;

import io.swagger.v3.oas.annotations.enums.ParameterIn;
import java.util.Set;
import org.springdoc.core.fn.builders.operation.Builder;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.server.ServerRequest;
import run.halo.app.extension.router.IListRequest;

public class SteamConsoleQuery {

    private static final int DEFAULT_PAGE = 1;
    private static final int DEFAULT_SIZE = 20;
    private static final int MAX_SIZE = 100;

    private static final Set<String> SORT_OPTIONS = Set.of("twoWeekTime", "totalTime", "name", "lastPlayed");
    private static final Set<String> HIDDEN_OPTIONS = Set.of("all", "hidden", "visible");
    private static final Set<String> ACTIVITY_OPTIONS = Set.of("all", "active", "inactive");

    private final MultiValueMap<String, String> queryParams;

    public SteamConsoleQuery(ServerRequest request) {
        this.queryParams = request.queryParams();
    }

    public int getPage() {
        return parseInt(queryParams.getFirst("page"), DEFAULT_PAGE, Integer.MAX_VALUE);
    }

    public int getSize() {
        return parseInt(queryParams.getFirst("size"), DEFAULT_SIZE, MAX_SIZE);
    }

    public String getKeyword() {
        String keyword = queryParams.getFirst("keyword");
        if (!StringUtils.hasText(keyword)) {
            return "";
        }
        return keyword.trim();
    }

    public String getSort() {
        return normalizeOption(queryParams.getFirst("sort"), "twoWeekTime", SORT_OPTIONS);
    }

    public String getHidden() {
        return normalizeOption(queryParams.getFirst("hidden"), "all", HIDDEN_OPTIONS);
    }

    public String getActivity() {
        return normalizeOption(queryParams.getFirst("activity"), "all", ACTIVITY_OPTIONS);
    }

    public static void buildParameters(Builder builder) {
        IListRequest.buildParameters(builder);
        builder
            .parameter(parameterBuilder()
                .in(ParameterIn.QUERY)
                .name("keyword")
                .description("Search by game name or App ID.")
                .implementation(String.class)
                .required(false))
            .parameter(parameterBuilder()
                .in(ParameterIn.QUERY)
                .name("sort")
                .description("Sort field: twoWeekTime / totalTime / name / lastPlayed.")
                .implementation(String.class)
                .required(false))
            .parameter(parameterBuilder()
                .in(ParameterIn.QUERY)
                .name("hidden")
                .description("Hidden filter: all / hidden / visible.")
                .implementation(String.class)
                .required(false))
            .parameter(parameterBuilder()
                .in(ParameterIn.QUERY)
                .name("activity")
                .description("Activity filter: all / active / inactive.")
                .implementation(String.class)
                .required(false));
    }

    private int parseInt(String value, int defaultValue, int maxValue) {
        if (!StringUtils.hasText(value)) {
            return defaultValue;
        }
        try {
            int parsed = Integer.parseInt(value);
            if (parsed <= 0) {
                return defaultValue;
            }
            return Math.min(parsed, maxValue);
        } catch (NumberFormatException ignored) {
            return defaultValue;
        }
    }

    private String normalizeOption(String rawValue, String fallback, Set<String> supported) {
        if (!StringUtils.hasText(rawValue)) {
            return fallback;
        }
        String normalized = rawValue.trim();
        return supported.contains(normalized) ? normalized : fallback;
    }
}
