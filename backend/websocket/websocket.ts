import http from "http";
import { Server } from "socket.io";
import { ErrorMessageType, EventsFromServer, EventsToServer, InfoMessageType } from "../../shared/types/websocket";
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
        try {
          this.lobbyService.joinLobby(lobbyId, clientId);
          await socket.join(lobbyId);
          const infoMessage = `Client with id: ${clientId} joined "${lobbyId}" lobby and ws-room with same id`;
          socket.to(lobbyId).emit("INFO_MESSAGE", { type: InfoMessageType.GENERAL, message: infoMessage, id: v4() });
        } catch (error) {
          console.error(error);
          const errorMessage = error instanceof Error ? error.message : "An unknown error...";
          socket.emit("ERROR_MESSAGE", { type: ErrorMessageType.GENERAL, message: errorMessage, id: v4() });
        }

        this.io.emit("LOBBY_LIST", this.lobbyService.lobbys);
      });

      socket.on("PING", async (data) => {
        // await delay(123);
        socket.emit("PONG", { pongId: data.pingId });
      });

      socket.on("CREATE_LOBBY", async (data, callback) => {
        try {
          const lobbyId = this.lobbyService.createLobby({
            ...data,
            clients: [clientId],
            createdAt: Date.now(),
            hostId: clientId,
          });
          await socket.join(lobbyId);
          this.io.emit("LOBBY_LIST", this.lobbyService.lobbys);
          const infoMessage = `You successfully created lobby`;
          socket.emit("INFO_MESSAGE", { type: InfoMessageType.GENERAL, message: infoMessage, id: v4() });
          callback({ lobbyId });
        } catch (error) {
          console.error(error);
          const errorMessage = error instanceof Error ? error.message : "An unknown error...";
          socket.emit("ERROR_MESSAGE", { type: ErrorMessageType.GENERAL, message: errorMessage, id: v4() });
        }
      });

      socket.on("GET_LOBBY_LIST", () => {
        socket.emit("LOBBY_LIST", this.lobbyService.lobbys);
      });
    });
  }
}
