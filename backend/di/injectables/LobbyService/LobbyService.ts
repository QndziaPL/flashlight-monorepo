import { CreateLobbyProps, ILobby } from "../../../../shared/types/lobby";
import { v4 as uuid } from "uuid";
import { injectable } from "inversify";
import { Lobby } from "../../../lobby/Lobby";
import { arrayFromMap } from "../../../../shared/helpers/arrayFromMap";

@injectable()
// implements IWithIO
export class LobbyService {
  // private readonly io: WebSocketServer<EventsToServer, EventsFromServer>;

  // constructor(@inject(INJECTABLE_TYPES.WebSocketService) private readonly webSocketService: WebSocketService) {
  //   this.io = webSocketService.io;
  // }

  // initializeEvents() {
  //   this.io.on("connection", () => {
  //     console.log("KONEKSZYN ZAJEBANE Z LOBBYSERVICE");
  //   });
  // }

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
