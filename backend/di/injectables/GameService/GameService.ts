import { Game, GameProps, GameSnapshotForDB } from "../../../game/Game";
import { LobbyService } from "../LobbyService/LobbyService";
import { WebSocketService } from "../WebSocketService/WebSocketService";
import { inject, injectable } from "inversify";
import { INJECTABLE_TYPES } from "../types";

@injectable()
export class GameService {
  private games: Map<Game["id"], Game> = new Map();

  constructor(
    @inject(INJECTABLE_TYPES.LobbyService) private readonly lobbyService: LobbyService,
    @inject(INJECTABLE_TYPES.WebSocketService) private readonly webSocketService: WebSocketService,
  ) {}

  createGame(gameProps: GameProps) {
    const game = new Game(this, gameProps);
    this.games.set(game.id, game);
  }

  updateGameSnapshot(gameSnapshot: GameSnapshotForDB) {
    //TODO: store game snapshot in firebase
  }
}
