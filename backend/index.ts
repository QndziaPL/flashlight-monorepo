import cors from "cors";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import { Server } from "socket.io";

dotenv.config();

const app: Application = express();

const httpPort = 8000;
const wsPort = 8080;

app.use(cors());

const io = new Server(wsPort, {
  cors: { origin: "*" },
  // cors: { origin: "http://localhost:5173" },
});

app.get("/", (req: Request, res: Response) => {
  res.send("Elo kurwy");
});

app.listen(httpPort, () => console.log(`Http napierdala na porcie: ${httpPort}`));

io.on("connection", (socket) => {
  console.log(`Podłączono klienta o id: ${socket.id}`);
  socket.emit("initialMessage", "MAMY KLIENTA");
  socket.on("playerShoot", (msg) => {
    socket.emit("afterShoot", `zakurwiłeś pizdo na ${msg.x}x${msg.y}`);
  });
});
