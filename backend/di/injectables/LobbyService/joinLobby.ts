import { LobbyService } from "./LobbyService";
import { Socket } from "../WebSocketService/WebSocketService";
import { ErrorMessageType, InfoMessageType } from "../../../../shared/types/websocket";
import { v4 } from "uuid";

export const handleJoinLobby = async (
  lobbyId: string,
  clientId: string,
  lobbyService: LobbyService,
  socket: Socket,
) => {
  try {
    joinLobby(lobbyId, clientId, lobbyService);
    await socket.join(lobbyId);
    const infoMessage = `Client with id: ${clientId} joined "${lobbyId}" lobby and ws-room with same id`;
    socket.to(lobbyId).emit("INFO_MESSAGE", { type: InfoMessageType.GENERAL, message: infoMessage, id: v4() });
    lobbyService.emitLobbyList();
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error...";
    socket.emit("ERROR_MESSAGE", { type: ErrorMessageType.GENERAL, message: errorMessage, id: v4() });
  }
};

const joinLobby = (lobbyId: string, clientId: string, lobbyService: LobbyService) => {
  const lobby = lobbyService.getLobbyById(lobbyId);
  if (lobby.clients.includes(clientId)) {
    throw Error(`Client with id ${clientId} is already on client list in ${lobbyId} lobby`);
  }
  lobby.addClient(clientId);
};
