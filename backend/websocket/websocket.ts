import http from "http";
import { Server } from "socket.io";
import { ErrorMessageType, EventsFromServer, EventsToServer } from "../../shared/types/websocket";
import { LobbyService } from "../services/LobbyService";
import { ClientsService } from "../services/ClientsService";
import { v4 } from "uuid";

export class WebSocketClient {
  private io: Server<EventsToServer, EventsFromServer>;
  private lobbyService: LobbyService;
  private players: ClientsService = new ClientsService();

  constructor(httpServer: http.Server, lobbyService: LobbyService) {
    this.lobbyService = lobbyService;
    this.io = new Server<EventsToServer, EventsFromServer>(httpServer, {
      cors: { origin: "*" },
    });

    this.initializeEvents();
  }

  private initializeEvents(): void {
    this.io.on("connection", (socket) => {
      const clientId = socket.handshake.auth.clientId;
      console.log(`Connected WS client ${clientId}`);
      socket.emit("LOBBY_LIST", this.lobbyService.lobbys);

      socket.on("JOIN_LOBBY", async ({ lobbyId }) => {
        await socket.join(lobbyId);
        const infoMessage = `Client with id: ${clientId} joined "${lobbyId}" lobby and ws-room with same id`;
        socket.to(lobbyId).emit("INFO_MESSAGE", infoMessage);
        try {
          this.lobbyService.joinLobby(lobbyId, clientId);
        } catch (error) {
          console.error(error);
          const errorMessage = error instanceof Error ? error.message : "An unknown error...";
          socket.emit("ERROR_MESSAGE", { type: ErrorMessageType.GENERAL, message: errorMessage, id: v4() });
        }

        this.io.emit("LOBBY_LIST", this.lobbyService.lobbys);
      });

      socket.on("CREATE_LOBBY", (data) => {
        this.lobbyService.createLobby({ ...data, clients: [clientId], createdAt: Date.now(), hostId: clientId });
        this.io.emit("LOBBY_LIST", this.lobbyService.lobbys);
      });

      socket.on("GET_LOBBY_LIST", () => {
        socket.emit("LOBBY_LIST", this.lobbyService.lobbys);
      });
    });
  }
}
