import http from "http";
import { Server } from "socket.io";
import { EventsFromServer, EventsToServer } from "../../shared/types/websocket";
import { LobbyService } from "../services/LobbyService";
import { ClientsService } from "../services/ClientsService";

export class WebSocketClient {
  private io: Server<EventsToServer, EventsFromServer>;
  private lobbyService: LobbyService = new LobbyService();
  private players: ClientsService = new ClientsService();

  constructor(httpServer: http.Server) {
    this.io = new Server<EventsToServer, EventsFromServer>(httpServer, {
      cors: { origin: "*" },
    });

    this.initializeEvents();
  }

  private initializeEvents(): void {
    this.io.on("connection", (socket) => {
      console.log(`Connected client with socketId: ${socket.id}`);
      socket.emit("LOBBY_LIST", this.lobbyService.lobbys);

      socket.on("JOIN_ROOM", async ({ clientId, room }) => {
        await socket.join(room);
        const infoMessage = `Client with id: ${clientId} joined "${room}" room`;
        socket.to(room).emit("INFO_MESSAGE", infoMessage);
      });

      socket.on("CREATE_LOBBY", (data) => {
        this.lobbyService.createLobby({ ...data, clients: [data.hostId], createdAt: Date.now() });
        this.io.emit("LOBBY_LIST", this.lobbyService.lobbys);
      });

      socket.on("GET_LOBBY_LIST", () => {
        socket.emit("LOBBY_LIST", this.lobbyService.lobbys);
      });
    });
  }
}
