import cors from "cors";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import { Server } from "socket.io";
import http from "http";
import { FirebaseClient } from "./firebase/firebase";
import lobbyRouter from "./router/lobbyRouter";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

const server = http.createServer(app);

const port = 80;

const io = new Server(server, {
  cors: { origin: "*" },
});

const firebase = FirebaseClient.getInstance();

app.get("/", (req: Request, res: Response) => {
  res.send("Elo kurwy");
});

// app.get("/lobbys", async (req: Request, res: Response) => {
//   const lobbysData = await firebase.getCollection<Lobby>("lobbys");
//   if (lobbysData) {
//     res.send(lobbysData);
//   } else {
//     res.status(404).send("Could not find data");
//   }
// });

app.use("/api", lobbyRouter);

server.listen(port, () => console.log(`Http napierdala na porcie: ${port}`));

io.on("connection", (socket) => {
  console.log(`Podłączono klienta o id: ${socket.id}`);
  socket.emit("initialMessage", "MAMY KLIENTA");
  socket.on("playerShoot", (msg) => {
    socket.emit("afterShoot", `zakurwiłeś pizdo na ${msg.x}x${msg.y}`);
  });
});

io.on("FE_CONNECTED", (msg) => {
  console.log(msg);
});
