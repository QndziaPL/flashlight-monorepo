import { Server as WebSocketServer } from "socket.io";
import {
  ErrorMessageType,
  EventsFromServer,
  EventsToServer,
  InfoMessageType,
} from "../../../../shared/types/websocket";
import { LobbyService } from "../LobbyService/LobbyService";
import { ClientsService } from "../../../services/ClientsService/ClientsService";
import { v4 } from "uuid";
import { ServerService } from "../ServerService/ServerService";
import { inject, injectable } from "inversify";
import { INJECTABLE_TYPES } from "../types";

@injectable()
export class WebSocketService {
  private readonly _io: WebSocketServer<EventsToServer, EventsFromServer>;
  private players: ClientsService = new ClientsService();

  constructor(
    @inject(INJECTABLE_TYPES.ServerService) private readonly serverService: ServerService,
    @inject(INJECTABLE_TYPES.LobbyService) private readonly lobbyService: LobbyService,
  ) {
    this.lobbyService = lobbyService;
    this._io = new WebSocketServer<EventsToServer, EventsFromServer>(serverService.server, {
      cors: { origin: "*" },
    });

    this.initializeEvents();
  }

  get io() {
    return this._io;
  }

  private initializeEvents(): void {
    this._io.on("connection", (socket) => {
      const clientId = socket.handshake.auth.clientId;
      console.log(`Connected WS client ${clientId}`);
      socket.emit("LOBBY_LIST", this.lobbyService.lobbysFlatData);

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

        this._io.emit("LOBBY_LIST", this.lobbyService.lobbysFlatData);
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
          this._io.emit("LOBBY_LIST", this.lobbyService.lobbysFlatData);
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
        socket.emit("LOBBY_LIST", this.lobbyService.lobbysFlatData);
      });
    });
  }
}
