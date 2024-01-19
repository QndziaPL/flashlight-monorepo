import cors from "cors";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import http from "http";
import lobbyRouter from "./router/lobbyRouter";
import { WebSocketClient } from "./websocket/websocket";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

const server = http.createServer(app);

const port = process.env.PORT ?? 80;

app.get("/", (req: Request, res: Response) => {
  res.send("Elo kurwy");
});

app.use("/api", lobbyRouter);

const webSocketClient = new WebSocketClient(server);

server.listen(port, () => console.log(`Http napierdala na porcie: ${port}`));
