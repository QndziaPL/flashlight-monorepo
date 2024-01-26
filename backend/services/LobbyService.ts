import { CreateLobbyProps, ILobby } from "../../shared/types/lobby";
import { v4 as uuid } from "uuid";

export class LobbyService {
  private _lobbys: ILobby[] = [];

  public get lobbys(): ILobby[] {
    return this._lobbys;
  }

  public createLobby(data: CreateLobbyProps) {
    const lobby: ILobby = {
      ...data,
      id: uuid(),
    };
    this._lobbys.push(lobby);
  }

  //TODO: consider generic error handling for ws (for example, someone tries to join lobby but there is no lobby with sent id)
  //TODO: and based on this error we can notify frontend that something went wrong with "ERROR_MESSAGE" event for example
  public joinLobby(lobbyId: string, clientId: string) {
    const lobbyIndex = this._lobbys.findIndex((lobby) => lobby.id === lobbyId);
    if (lobbyIndex === -1) {
      throw Error(`Couldn't find lobby with id ${lobbyId}`);
    }
    const copy = [...this._lobbys];
    const currentClients = copy[lobbyIndex].clients;
    if (currentClients.includes(clientId)) {
      throw Error(`Client with id ${clientId} is already on client list in ${lobbyId} lobby`);
    }
    currentClients.push(clientId);
    this._lobbys = copy;
  }

  public deleteLobby(id: ILobby["id"]) {
    this._lobbys = this._lobbys.filter((lobby) => lobby.id !== id);
  }
}
