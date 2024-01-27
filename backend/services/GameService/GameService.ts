import { Game, GameProps, GameSnapshotForDB } from "../../game/Game";
import { LobbyService } from "../LobbyService";
import { WebSocketClient } from "../../websocket/websocket";

export class GameService {
  private games: Map<Game["id"], Game> = new Map();
  private readonly lobbyService: LobbyService;
  private readonly webSocketClient: WebSocketClient;

  constructor(lobbyService: LobbyService, webSocketClient: WebSocketClient) {
    this.lobbyService = lobbyService;
    this.webSocketClient = webSocketClient;
  }

  createGame(gameProps: GameProps) {
    const game = new Game(this, gameProps);
    this.games.set(game.id, game);
  }

  updateGameSnapshot(gameSnapshot: GameSnapshotForDB) {
    //TODO: store game snapshot in firebase
  }
}
