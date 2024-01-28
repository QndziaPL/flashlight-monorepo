import { ILobby } from "../../../../shared/types/lobby";
import { inject, injectable } from "inversify";
import { Lobby } from "../../../lobby/Lobby";
import { arrayFromMap } from "../../../../shared/helpers/arrayFromMap";
import { IWithIO } from "../../../interfaces/interfaces";
import { INJECTABLE_TYPES } from "../types";
import { SocketIOServer, WebSocketService } from "../WebSocketService/WebSocketService";
import { handleJoinLobby } from "./joinLobby";
import { handleCreateLobby } from "./createLobby";

@injectable()
export class LobbyService implements IWithIO {
  private _lobbys: Map<Lobby["id"], Lobby> = new Map();
  private readonly _io: SocketIOServer;

  constructor(@inject(INJECTABLE_TYPES.WebSocketService) private readonly webSocketService: WebSocketService) {
    this._io = webSocketService.io;

    this.initializeEvents();
  }

  initializeEvents() {
    this._io.on("connection", (socket) => {
      const clientId = socket.handshake.auth.clientId;
      console.log(`InitializeEvents for ${clientId} in LobbyService`);
      socket.emit("LOBBY_LIST", this.lobbysFlatData);

      socket.on("JOIN_LOBBY", ({ lobbyId }) => handleJoinLobby(lobbyId, clientId, this, socket));
      socket.on("CREATE_LOBBY", async (data, callback) => handleCreateLobby(data, callback, this, clientId, socket));
      socket.on("GET_LOBBY_LIST", () => socket.emit("LOBBY_LIST", this.lobbysFlatData));
    });
  }

  get io() {
    return this._io;
  }

  getLobbyById(lobbyId: string): Lobby | undefined {
    return this._lobbys.get(lobbyId);
  }

  emitLobbyList() {
    this._io.emit("LOBBY_LIST", this.lobbysFlatData);
  }

  public get lobbysFlatData(): ILobby[] {
    return arrayFromMap(this._lobbys).map((lobby) => lobby.flatData);
  }

  public get lobbys() {
    return this._lobbys;
  }

  public addLobby(lobby: Lobby) {
    this._lobbys.set(lobby["id"], lobby);
  }

  public deleteLobby(id: ILobby["id"]) {
    // this._lobbys = this._lobbys.filter((lobby) => lobby.id !== id);
  }
}
