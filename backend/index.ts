import cors from "cors";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import http from "http";
import { WebSocketClient } from "./websocket/websocket";
import { LobbyService } from "./services/LobbyService";
import LobbyRouter from "./router/LobbyRouter";
import { GameService } from "./services/GameService/GameService";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

const server = http.createServer(app);

const port = process.env.PORT ?? 80;

const lobbyService = new LobbyService();
const webSocketClient = new WebSocketClient(server, lobbyService);
const lobbyRouter = new LobbyRouter(lobbyService, webSocketClient);
const gameService = new GameService(lobbyService, webSocketClient);

app.get("/", (req: Request, res: Response) => {
  res.send("Elo kurwy");
});

app.use("/api/lobbys", lobbyRouter.getRouter());

server.listen(port, () => console.log(`Http napierdala na porcie: ${port}`));
