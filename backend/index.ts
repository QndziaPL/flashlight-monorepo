import cors from "cors";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import { Server } from "socket.io";
import http from "http";
import lobbyRouter from "./router/lobbyRouter";
import { WSEvent } from "../shared/types/websocket";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

const server = http.createServer(app);

const port = process.env.PORT ?? 80;

const io = new Server(server, {
  cors: { origin: "*" },
});

app.get("/", (req: Request, res: Response) => {
  res.send("Elo kurwy");
});

app.use("/api", lobbyRouter);

server.listen(port, () => console.log(`Http napierdala na porcie: ${port}`));

io.on("connection", (socket) => {
  console.log(`Connected client with socketId: ${socket.id}`);

  socket.on("playerShoot", (msg) => {
    socket.emit("afterShoot", `zakurwiłeś pizdo na ${msg.x}x${msg.y}`);
  });

  socket.on(WSEvent.JOIN_ROOM, async ({ clientId, roomName, RTCAnswer }) => {
    await socket.join(roomName);
    const infoMessage = `Client with id: ${clientId} joined "${roomName}" room`;
    socket.to(roomName).emit(WSEvent.INFO_MESSAGE, infoMessage);
    if (RTCAnswer) {
      console.log(RTCAnswer);
      socket.to(roomName).emit(WSEvent.RTC_ANSWER, RTCAnswer);
    }
    console.log(infoMessage);
  });

  socket.on(WSEvent.ICE_CANDIDATE, (candidate) => {
    socket.rooms.forEach((room) => {
      console.log(room, candidate);
      socket.to(room).emit(WSEvent.ICE_CANDIDATE, candidate);
    });
  });
});

io.on("FE_CONNECTED", (msg) => {
  console.log(msg);
});
