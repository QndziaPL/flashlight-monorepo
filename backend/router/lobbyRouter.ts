import express, {Request, Response} from "express";
import {FirebaseClient} from "../firebase/firebase";
import {CreateLobbyProps, Lobby} from "../../shared/types/lobby";

const ROUTE = "/lobbys";
const router = express.Router();
const firebase = FirebaseClient.getInstance();

router.get(ROUTE, async (req: Request, res: Response) => {
    const lobbysData = await firebase.getCollection<Lobby>("lobbys");
    if (lobbysData) {
        res.send(lobbysData.sort((a, b) => a.createdAt > b.createdAt ? -1 : 1));
    } else {
        res.status(404).send("Could not find data");
    }
});

router.post(ROUTE, async (req: Request, res: Response) => {
    const lobbyData: CreateLobbyProps = {
        name: req.body.name,
        hostId: req.body.hostId,
        clients: [req.body.hostId],
        webrtc: req.body.webrtc,
        createdAt: Date.now()
    };

    const lobbyId = await firebase.createLobby(lobbyData);
    if (lobbyId) {
        res.send({lobbyId})
    } else {
        res.status(500).send(`Couldn't create lobby. Firebase did not crete lobbyId for provided data: ${JSON.stringify(lobbyData)}`)
    }
});

router.delete(ROUTE, async (req: Request, res: Response) => {
    try {
        await firebase.deleteLobby(req.body.lobbyId)
        res.send({message: `Lobby with ID ${req.body.lobbyId} deleted successfully`})
    } catch (error) {
        res.status(500).send(error)
    }

})

export default router;
