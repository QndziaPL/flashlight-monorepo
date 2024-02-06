import { LobbyDTO } from "../../../../shared/types/lobby";
import { inject, injectable } from "inversify";
import { IWithIO } from "../../../interfaces/interfaces";
import { INJECTABLE_TYPES } from "../types";
import { Socket, SocketIOServer, WebSocketService } from "../WebSocketService/WebSocketService";
import { handleJoinLobby } from "./joinLobby";
import { handleCreateLobby } from "./createLobby";
import { handleDeleteLobby } from "./deleteLobby";
import { handleChatMessage } from "./chatMessage";
import { handleLeaveLobby } from "./leaveLobby";
import { LobbyRepository } from "../../../repositories/LobbyRepository";
import { Lobby } from "../../../lobby/Lobby";

@injectable()
export class LobbyService implements IWithIO {
  private readonly _io: SocketIOServer;

  constructor(
    @inject(INJECTABLE_TYPES.WebSocketService) private readonly webSocketService: WebSocketService,
    @inject(INJECTABLE_TYPES.LobbyRepository) private readonly lobbyRepository: LobbyRepository,
  ) {
    this._io = webSocketService.io;

    this.initializeEvents();
    console.log("siemanko");
  }

  initializeEvents() {
    this._io.on("connection", (socket) => {
      const clientId = socket.handshake.auth.clientId;
      console.log(`InitializeEvents for ${clientId} in LobbyService`);
      socket.emit("LOBBY_LIST", this.lobbysFlatData);

      socket.on("JOIN_LOBBY", ({ lobbyId }) =>
        handleJoinLobby(lobbyId, clientId, this.lobbyRepository, socket, this.emitLobbyList),
      );
      socket.on("LEAVE_LOBBY", ({ lobbyId }) =>
        handleLeaveLobby(
          lobbyId,
          clientId,
          this.lobbyRepository,
          socket,
          this.deleteLobby,
          this._io,
          this.emitLobbyList,
        ),
      );
      socket.on("CREATE_LOBBY", async (data, callback) =>
        handleCreateLobby(data, callback, this.lobbyRepository, clientId, socket, this.emitLobbyList),
      );
      socket.on("GET_LOBBY_LIST", () => socket.emit("LOBBY_LIST", this.lobbysFlatData));
      socket.on("DELETE_LOBBY", async ({ lobbyId }) => this.deleteLobby(lobbyId, clientId, socket));
      socket.on("CHAT_MESSAGE", async (message) =>
        handleChatMessage(message, this.lobbyRepository, clientId, socket, this._io),
      );
    });
  }

  get io() {
    return this._io;
  }

  deleteLobby = (lobbyId: string, clientId: string, socket: Socket) => {
    handleDeleteLobby(lobbyId, clientId, this.lobbyRepository, socket, this._io, this.emitLobbyList);
  };

  emitLobbyList = () => {
    this._io.emit("LOBBY_LIST", this.lobbysFlatData);
  };

  public get lobbysFlatData(): LobbyDTO[] {
    return this.lobbyRepository.getAll().map((lobby) => lobby.getDto);
  }

  public get lobbys(): Lobby[] {
    return this.lobbyRepository.getAll();
  }
}
