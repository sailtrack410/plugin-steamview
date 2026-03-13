package www.sailtrack.cn.steamview.endpoint;

import static org.springdoc.core.fn.builders.apiresponse.Builder.responseBuilder;

import lombok.RequiredArgsConstructor;
import org.springdoc.webflux.core.fn.SpringdocRouteBuilder;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import run.halo.app.core.extension.endpoint.CustomEndpoint;
import run.halo.app.extension.GroupVersion;
import www.sailtrack.cn.steamview.model.SteamPublicGamesResponse;
import www.sailtrack.cn.steamview.service.SteamViewDataService;

@Component
@RequiredArgsConstructor
public class SteamViewPublicEndpoint implements CustomEndpoint {

    private final SteamViewDataService dataService;

    @Override
    public RouterFunction<ServerResponse> endpoint() {
        final var tag = "api.steamview.halo.run/v1alpha1/SteamView";

        return SpringdocRouteBuilder.route()
            .GET("games", this::listPublicGames, builder -> builder
                .operationId("ListSteamGamesForPublic")
                .tag(tag)
                .description("Get steam games for public page.")
                .response(responseBuilder().implementation(SteamPublicGamesResponse.class)))
            .build();
    }

    @Override
    public GroupVersion groupVersion() {
        return GroupVersion.parseAPIVersion("api.steamview.halo.run/v1alpha1");
    }

    private Mono<ServerResponse> listPublicGames(ServerRequest request) {
        return dataService.getPublicGames()
            .flatMap(result -> ServerResponse.ok().bodyValue(result));
    }
}
