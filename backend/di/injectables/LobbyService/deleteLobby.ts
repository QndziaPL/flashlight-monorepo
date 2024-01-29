import { LobbyService } from "./LobbyService";
import { ErrorMessageType } from "../../../../shared/types/websocket";
import { v4 } from "uuid";
import { Socket } from "../WebSocketService/WebSocketService";
import { closeSocketRoom } from "../WebSocketService/closeSocketRoom";

export const handleDeleteLobby = async (
  lobbyId: string,
  clientId: string,
  lobbyService: LobbyService,
  socket: Socket,
) => {
  try {
    deleteLobby(lobbyId, clientId, lobbyService);
    socket.to(lobbyId).emit("LOBBY_DELETED", { lobbyId });
    closeSocketRoom(lobbyService.io, lobbyId);
    lobbyService.emitLobbyList();
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error...";
    socket.emit("ERROR_MESSAGE", { type: ErrorMessageType.GENERAL, message: errorMessage, id: v4() });
  }
};

const deleteLobby = (lobbyId: string, clientId: string, lobbyService: LobbyService) => {
  const lobby = lobbyService.getLobbyById(lobbyId);
  if (!lobby) {
    throw Error(`No lobby with id ${lobbyId}`);
  }
  if (lobby.flatData.hostId !== clientId) {
    throw Error(`Client ${clientId} has no access to delete this lobby`);
  }
  const successfullyDeleted = lobbyService.lobbys.delete(lobbyId);
  if (!successfullyDeleted) {
    throw Error("Error during calling delete on lobbys");
  }
};
