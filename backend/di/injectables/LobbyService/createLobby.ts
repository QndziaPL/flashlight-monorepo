import { ErrorMessageType, InfoMessageType } from "../../../../shared/types/websocket";
import { v4 as uuid, v4 } from "uuid";
import { CreateLobbyProps, FECreateLobbyProps } from "../../../../shared/types/lobby";
import { Lobby } from "../../../lobby/Lobby";
import { LobbyService } from "./LobbyService";
import { Socket } from "../WebSocketService/WebSocketService";

export const handleCreateLobby = async (
  lobbyData: FECreateLobbyProps,
  callback: (data: { lobbyId: string }) => void,
  lobbyService: LobbyService,
  clientId: string,
  socket: Socket,
) => {
  try {
    const lobbyId = createLobby(
      {
        ...lobbyData,
        clients: [clientId],
        createdAt: Date.now(),
        hostId: clientId,
      },
      lobbyService,
    );
    await socket.join(lobbyId);
    lobbyService.io.emit("LOBBY_LIST", lobbyService.lobbysFlatData);
    const infoMessage = `You successfully created lobby`;
    socket.emit("INFO_MESSAGE", { type: InfoMessageType.GENERAL, message: infoMessage, id: v4() });
    callback({ lobbyId });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error...";
    socket.emit("ERROR_MESSAGE", { type: ErrorMessageType.GENERAL, message: errorMessage, id: v4() });
  }
};

const createLobby = (data: CreateLobbyProps, lobbyService: LobbyService) => {
  if (lobbyService.lobbysFlatData.some((lobby) => lobby.clients.includes(data.hostId))) {
    throw Error(`Couldn't create lobby. Client ${data.hostId} is already part of an other lobby`);
  }
  const id = uuid();
  const newLobby = new Lobby(id, data.name, data.hostId, data.clients, data.createdAt);
  lobbyService.addLobby(newLobby);
  return id;
};
