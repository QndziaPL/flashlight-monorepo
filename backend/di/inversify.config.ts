import "reflect-metadata";
import { Container } from "inversify";
import { INJECTABLE_TYPES } from "./injectables/types";
import { LobbyService } from "./injectables/LobbyService/LobbyService";
import { WebSocketService } from "./injectables/WebSocketService/WebSocketService";
import { ServerService } from "./injectables/ServerService/ServerService";
import { GameService } from "./injectables/GameService/GameService";

export const container = new Container();

container.bind<ServerService>(INJECTABLE_TYPES.ServerService).to(ServerService).inSingletonScope();
container.bind<WebSocketService>(INJECTABLE_TYPES.WebSocketService).to(WebSocketService).inSingletonScope();
container.bind<LobbyService>(INJECTABLE_TYPES.LobbyService).to(LobbyService).inSingletonScope();
container.bind<GameService>(INJECTABLE_TYPES.GameService).to(GameService).inSingletonScope();
