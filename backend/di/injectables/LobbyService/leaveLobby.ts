import { LobbyService } from "./LobbyService";
import { Socket } from "../WebSocketService/WebSocketService";
import { ErrorMessageType, InfoMessageType } from "../../../../shared/types/websocket";
import { v4 } from "uuid";
import { closeSocketRoom } from "../WebSocketService/closeSocketRoom";

export const handleLeaveLobby = (lobbyId: string, clientId: string, lobbyService: LobbyService, socket: Socket) => {
  try {
    const lobby = leaveLobby(lobbyId, clientId, lobbyService);
    if (!lobby.clients.length) {
      lobbyService.deleteLobby(lobbyId, clientId, socket);
      return;
    }
    const infoMessage = `Player ${clientId} left "${lobbyService.getLobbyById(lobbyId).flatData.name}" lobby`;
    socket.to(lobbyId).emit("INFO_MESSAGE", { type: InfoMessageType.GENERAL, message: infoMessage, id: v4() });
    closeSocketRoom(lobbyService.io, lobbyId, socket.id);
    lobbyService.emitLobbyList();
    socket.emit("LOBBY_LEFT", { lobbyId });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error...";
    socket.emit("ERROR_MESSAGE", { type: ErrorMessageType.GENERAL, message: errorMessage, id: v4() });
  }
};

const leaveLobby = (lobbyId: string, clientId: string, lobbyService: LobbyService) => {
  const lobby = lobbyService.getLobbyById(lobbyId);
  if (!lobby.clients.includes(clientId)) {
    throw Error(`We couldn't find you in this lobby`);
  }
  lobby.removeClient(clientId);
  return lobby;
};
