package www.sailtrack.cn.steamview.endpoint;

import static org.springdoc.core.fn.builders.apiresponse.Builder.responseBuilder;
import static org.springdoc.core.fn.builders.parameter.Builder.parameterBuilder;

import io.swagger.v3.oas.annotations.enums.ParameterIn;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springdoc.webflux.core.fn.SpringdocRouteBuilder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import run.halo.app.core.extension.endpoint.CustomEndpoint;
import run.halo.app.extension.GroupVersion;
import www.sailtrack.cn.steamview.model.SteamConnectionResult;
import www.sailtrack.cn.steamview.model.SteamConsoleGamesResponse;
import www.sailtrack.cn.steamview.model.SteamHiddenGamesResult;
import www.sailtrack.cn.steamview.model.SteamRefreshResult;
import www.sailtrack.cn.steamview.query.SteamConsoleQuery;
import www.sailtrack.cn.steamview.service.SteamViewConfigService;
import www.sailtrack.cn.steamview.service.SteamViewDataService;

@Component
@RequiredArgsConstructor
public class SteamViewConsoleEndpoint implements CustomEndpoint {

    private final SteamViewDataService dataService;
    private final SteamViewConfigService configService;

    @Override
    public RouterFunction<ServerResponse> endpoint() {
        final var tag = "console.api.steamview.halo.run/v1alpha1/SteamView";

        return SpringdocRouteBuilder.route()
            .GET("games", this::listGames, builder -> {
                builder.operationId("ListSteamGamesForConsole")
                    .tag(tag)
                    .description("List steam games for console management.")
                    .response(responseBuilder().implementation(SteamConsoleGamesResponse.class));
                SteamConsoleQuery.buildParameters(builder);
            })
            .POST("games/-/refresh", this::refreshGames, builder -> builder
                .operationId("RefreshSteamGames")
                .tag(tag)
                .description("Refresh steam games data.")
                .response(responseBuilder().implementation(SteamRefreshResult.class)))
            .GET("connection/test", this::testConnection, builder -> builder
                .operationId("TestSteamConnection")
                .tag(tag)
                .description("Test steam API connection.")
                .response(responseBuilder().implementation(SteamConnectionResult.class)))
            .POST("games/{appId}/hide", this::hideGame, builder -> builder
                .operationId("HideSteamGame")
                .tag(tag)
                .description("Hide one game from public page.")
                .parameter(parameterBuilder()
                    .in(ParameterIn.PATH)
                    .name("appId")
                    .required(true)
                    .implementation(String.class))
                .response(responseBuilder().implementation(SteamHiddenGamesResult.class)))
            .DELETE("games/{appId}/hide", this::unhideGame, builder -> builder
                .operationId("UnhideSteamGame")
                .tag(tag)
                .description("Cancel hidden state of one game.")
                .parameter(parameterBuilder()
                    .in(ParameterIn.PATH)
                    .name("appId")
                    .required(true)
                    .implementation(String.class))
                .response(responseBuilder().implementation(SteamHiddenGamesResult.class)))
            .build();
    }

    @Override
    public GroupVersion groupVersion() {
        return GroupVersion.parseAPIVersion("console.api.steamview.halo.run/v1alpha1");
    }

    private Mono<ServerResponse> listGames(ServerRequest request) {
        SteamConsoleQuery query = new SteamConsoleQuery(request);
        return resolveIngestedBy(request)
            .flatMap(ingestedBy -> dataService.listConsoleGames(query, ingestedBy))
            .flatMap(result -> ServerResponse.ok().bodyValue(result));
    }

    private Mono<ServerResponse> refreshGames(ServerRequest request) {
        return resolveIngestedBy(request)
            .flatMap(ingestedBy -> dataService.refreshGames(ingestedBy)
                .map(data -> new SteamRefreshResult(true, "刷新成功", data))
                .onErrorResume(error -> Mono.just(new SteamRefreshResult(false,
                    "刷新失败: " + error.getMessage(), null))))
            .flatMap(result -> ServerResponse.ok().bodyValue(result));
    }

    private Mono<ServerResponse> testConnection(ServerRequest request) {
        return dataService.testConnection()
            .flatMap(result -> ServerResponse.ok().bodyValue(result));
    }

    private Mono<ServerResponse> hideGame(ServerRequest request) {
        String appId = request.pathVariable("appId");
        return configService.hideGame(appId)
            .map(hiddenGames -> new SteamHiddenGamesResult(true, "游戏已隐藏", hiddenGames))
            .flatMap(result -> ServerResponse.ok().bodyValue(result));
    }

    private Mono<ServerResponse> unhideGame(ServerRequest request) {
        String appId = request.pathVariable("appId");
        return configService.unhideGame(appId)
            .map(hiddenGames -> new SteamHiddenGamesResult(true, "游戏已取消隐藏", hiddenGames))
            .flatMap(result -> ServerResponse.ok().bodyValue(result));
    }

    private Mono<String> resolveIngestedBy(ServerRequest request) {
        return request.principal()
            .map(Principal::getName)
            .map(String::trim)
            .filter(StringUtils::hasText)
            .defaultIfEmpty(SteamViewDataService.SYSTEM_INGESTED_BY)
            .onErrorReturn(SteamViewDataService.SYSTEM_INGESTED_BY);
    }
}
