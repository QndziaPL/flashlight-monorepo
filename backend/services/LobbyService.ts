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

  public deleteLobby(id: ILobby["id"]) {
    this._lobbys = this._lobbys.filter((lobby) => lobby.id !== id);
  }
}
