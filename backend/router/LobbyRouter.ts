import express, { Request, Response, Router } from "express";
import { FirebaseClient } from "../firebase/firebase";
import { LobbyService } from "../services/LobbyService";
import { WebSocketClient } from "../websocket/websocket";

export default class LobbyRouter {
  private router: Router;
  private lobbyService: LobbyService;
  private webSocketClient: WebSocketClient;

  constructor(lobbyService: LobbyService, webSocketClient: WebSocketClient) {
    this.router = express.Router();
    this.lobbyService = lobbyService;
    this.webSocketClient = webSocketClient;
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.post("/join", this.joinLobby);
  };

  private joinLobby = (req: Request, res: Response) => {
    const canUserJoinLobby = checkIfUserCanJoinLobby(req.body);
    if (canUserJoinLobby.status === "ok") {
      res.send("OK");
    } else {
      res.status(403).send({ error: canUserJoinLobby.reason });
    }
  };

  public getRouter = () => this.router;
}

const checkIfUserCanJoinLobby = (body: Request["body"]): ValidationResponse => {
  if (body.lobbyId && body.clientId)
    return {
      status: "ok",
    };

  if (!body.lobbyId) {
    return { status: "error", reason: "No lobbyId provided" };
  }

  return {
    status: "error",
    reason: "No clientId provided",
  };
};

type ValidationResponse =
  | {
      status: "ok";
    }
  | { status: "error"; reason: string };
const ROUTE = "/lobbys";
const router = express.Router();
const firebase = FirebaseClient.getInstance();

// router.get(ROUTE, async (req: Request, res: Response) => {
//   const lobbysData = await firebase.getCollection<ILobby>("lobbys");
//   if (lobbysData) {
//     res.send(lobbysData.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)));
//   } else {
//     res.status(404).send("Could not find data");
//   }
// });
//
// router.post(ROUTE, async (req: Request, res: Response) => {
//   const lobbyData: CreateLobbyProps = {
//     name: req.body.name,
//     hostId: req.body.hostId,
//     clients: [req.body.hostId],
//     createdAt: Date.now(),
//   };
//
//   const lobbyId = await firebase.createLobby(lobbyData);
//   if (lobbyId) {
//     res.send({ lobbyId });
//   } else {
//     res
//       .status(500)
//       .send(`Couldn't create lobby. Firebase did not crete lobbyId for provided data: ${JSON.stringify(lobbyData)}`);
//   }
// });
//
// router.delete(ROUTE, async (req: Request, res: Response) => {
//   try {
//     await firebase.deleteLobby(req.body.lobbyId);
//     res.send({ message: `Lobby with ID ${req.body.lobbyId} deleted successfully` });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });
//
// export default router;
