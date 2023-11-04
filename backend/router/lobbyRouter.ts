import express, { Request, Response } from "express";
import { CreateLobbyProps, FirebaseClient } from "../firebase/firebase";
import { Lobby } from "../../shared/types";

const ROUTE = "/lobbys";
const router = express.Router();
const firebase = FirebaseClient.getInstance();

router.get(ROUTE, async (req: Request, res: Response) => {
  const lobbysData = await firebase.getCollection<Lobby>("lobbys");
  if (lobbysData) {
    res.send(lobbysData);
  } else {
    res.status(404).send("Could not find data");
  }
});

router.post(ROUTE, async (req: Request, res: Response) => {
  const lobbyData: CreateLobbyProps = {
    name: req.body.name,
    hostId: req.body.clientId,
    clients: [req.body.clientId],
    webrtc: req.body.webrtc,
  };

  await firebase.createLobby(lobbyData);

  res.send("Lobby created successfully");
});

export default router;
