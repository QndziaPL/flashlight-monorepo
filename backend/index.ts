import dotenv from "dotenv";
import { WebSocketService } from "./di/injectables/WebSocketService";
import { LobbyService } from "./services/LobbyService";
import LobbyRouter from "./router/LobbyRouter";
import { GameService } from "./services/GameService/GameService";
import { ServerService } from "./di/injectables/ServerService";

dotenv.config();

const lobbyService = new LobbyService();
const serverService = new ServerService();
const webSocketClient = new WebSocketService(serverService, lobbyService);
const lobbyRouter = new LobbyRouter(lobbyService, webSocketClient);
const gameService = new GameService(lobbyService, webSocketClient);

// app.get("/", (req: Request, res: Response) => {
//   res.send("Elo kurwy");
// });
//
// app.use("/api/lobbys", lobbyRouter.getRouter());

// server.listen(port, () => console.log(`Http napierdala na porcie: ${port}`));
