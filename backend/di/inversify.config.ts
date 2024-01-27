import "reflect-metadata";
import { Container } from "inversify";
import { LobbyService } from "../services/LobbyService";
import { INJECTABLE_TYPES } from "./injectables/types";

const container = new Container();
container.bind<LobbyService>(INJECTABLE_TYPES.LobbyService).to(LobbyService).inSingletonScope();
container;
