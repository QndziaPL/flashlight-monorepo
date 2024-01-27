import { GameService } from "../services/GameService/GameService";
import { v4 } from "uuid";

export type GameSnapshotForDB = {
  id: string;
};

export type GameProps = {
  players: string[]; // TODO: create classes for Player and Character
};

export class Game {
  private readonly _id: string;
  private readonly gameService: GameService;

  constructor(gameService: GameService, props: GameProps) {
    this.gameService = gameService;
    this._id = v4();
  }

  get id() {
    return this._id;
  }

  updateSnapshotInDb() {
    const gameSnapshot: GameSnapshotForDB = {} as GameSnapshotForDB;
    this.gameService.updateGameSnapshot(gameSnapshot);
  }
}
