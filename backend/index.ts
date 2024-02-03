import dotenv from "dotenv";
import { ServerService } from "./di/injectables/ServerService/ServerService";
import { container } from "./di/inversify.config";
import { INJECTABLE_TYPES } from "./di/injectables/types";
import { GameService } from "./di/injectables/GameService/GameService";
import { WebSocketService } from "./di/injectables/WebSocketService/WebSocketService";
import { LobbyService } from "./di/injectables/LobbyService/LobbyService";
import { LobbyRepository } from "./repositories/LobbyRepository";

dotenv.config();

container.get<ServerService>(INJECTABLE_TYPES.ServerService);
container.get<LobbyService>(INJECTABLE_TYPES.LobbyService);
container.get<WebSocketService>(INJECTABLE_TYPES.WebSocketService);
container.get<GameService>(INJECTABLE_TYPES.GameService);
container.get<LobbyRepository>(INJECTABLE_TYPES.LobbyRepository);

// app.get("/", (req: Request, res: Response) => {
//   res.send("Elo kurwy");
// });
//
// app.use("/api/lobbys", lobbyRouter.getRouter());
