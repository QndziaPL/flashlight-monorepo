import { CreateLobbyProps, ILobby } from "../../../../shared/types/lobby";
import { v4, v4 as uuid } from "uuid";
import { inject, injectable } from "inversify";
import { Lobby } from "../../../lobby/Lobby";
import { arrayFromMap } from "../../../../shared/helpers/arrayFromMap";
import { IWithIO } from "../../../interfaces/interfaces";
import {
  ErrorMessageType,
  EventsFromServer,
  EventsToServer,
  InfoMessageType,
} from "../../../../shared/types/websocket";
import { Server } from "socket.io";
import { INJECTABLE_TYPES } from "../types";
import { WebSocketService } from "../WebSocketService/WebSocketService";

@injectable()
export class LobbyService implements IWithIO {
  private readonly io: Server<EventsToServer, EventsFromServer>;

  constructor(@inject(INJECTABLE_TYPES.WebSocketService) private readonly webSocketService: WebSocketService) {
    this.io = webSocketService.io;

    this.initializeEvents();
  }

  //TODO: extract functions to helpers
  initializeEvents() {
    this.io.on("connection", (socket) => {
      const clientId = socket.handshake.auth.clientId;
      console.log(`InitializeEvents for ${clientId} in LobbyService`);
      socket.emit("LOBBY_LIST", this.lobbysFlatData);

      socket.on("JOIN_LOBBY", async ({ lobbyId }) => {
        try {
          this.joinLobby(lobbyId, clientId);
          await socket.join(lobbyId);
          const infoMessage = `Client with id: ${clientId} joined "${lobbyId}" lobby and ws-room with same id`;
          socket.to(lobbyId).emit("INFO_MESSAGE", { type: InfoMessageType.GENERAL, message: infoMessage, id: v4() });
        } catch (error) {
          console.error(error);
          const errorMessage = error instanceof Error ? error.message : "An unknown error...";
          socket.emit("ERROR_MESSAGE", { type: ErrorMessageType.GENERAL, message: errorMessage, id: v4() });
        }

        this.io.emit("LOBBY_LIST", this.lobbysFlatData);
      });

      socket.on("CREATE_LOBBY", async (data, callback) => {
        try {
          const lobbyId = this.createLobby({
            ...data,
            clients: [clientId],
            createdAt: Date.now(),
            hostId: clientId,
          });
          await socket.join(lobbyId);
          this.io.emit("LOBBY_LIST", this.lobbysFlatData);
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
        socket.emit("LOBBY_LIST", this.lobbysFlatData);
      });
    });
  }

  private _lobbys: Map<Lobby["id"], Lobby> = new Map();

  public get lobbysFlatData(): ILobby[] {
    return arrayFromMap(this._lobbys).map((lobby) => lobby.flatData);
  }

  public get lobbys() {
    return this._lobbys;
  }

  public createLobby(data: CreateLobbyProps) {
    if (this.lobbysFlatData.some((lobby) => lobby.clients.includes(data.hostId))) {
      throw Error(`Couldn't create lobby. Client ${data.hostId} is already part of an other lobby`);
    }
    const id = uuid();
    const newLobby = new Lobby(id, data.name, data.hostId, data.clients, data.createdAt);
    this._lobbys.set(id, newLobby);
    return id;
  }

  //TODO: consider generic error handling for ws (for example, someone tries to join lobby but there is no lobby with sent id)
  //TODO: and based on this error we can notify frontend that something went wrong with "ERROR_MESSAGE" event for example
  public joinLobby(lobbyId: string, clientId: string) {
    const lobby = this._lobbys.get(lobbyId);

    if (!lobby) {
      throw Error(`Couldn't find lobby with id ${lobbyId}`);
    }

    if (lobby.clients.includes(clientId)) {
      throw Error(`Client with id ${clientId} is already on client list in ${lobbyId} lobby`);
    }

    lobby.addClient(clientId);
  }

  public deleteLobby(id: ILobby["id"]) {
    // this._lobbys = this._lobbys.filter((lobby) => lobby.id !== id);
  }
}
