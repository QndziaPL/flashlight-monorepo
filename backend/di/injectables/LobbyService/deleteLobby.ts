import { ErrorMessageType } from "../../../../shared/types/websocket";
import { v4 } from "uuid";
import { Socket, SocketIOServer } from "../WebSocketService/WebSocketService";
import { closeSocketRoom } from "../WebSocketService/closeSocketRoom";
import { LobbyRepository } from "../../../repositories/LobbyRepository";

export const handleDeleteLobby = (
  lobbyId: string,
  clientId: string,
  lobbyRepository: LobbyRepository,
  socket: Socket,
  io: SocketIOServer,
  onSuccessCallback: () => void,
) => {
  try {
    deleteLobby(lobbyId, clientId, lobbyRepository);
    socket.to(lobbyId).emit("LOBBY_DELETED", { lobbyId });
    closeSocketRoom(io, lobbyId);
    onSuccessCallback();
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error...";
    socket.emit("ERROR_MESSAGE", { type: ErrorMessageType.GENERAL, message: errorMessage, id: v4() });
  }
};

const deleteLobby = (lobbyId: string, clientId: string, lobbyRepository: LobbyRepository) => {
  const lobby = lobbyRepository.getById(lobbyId);
  if (!lobby) {
    throw Error(`Couldn't find lobby with id ${lobbyId}`);
  }
  if (lobby?.getDto.hostId !== clientId) {
    throw Error(`Client ${clientId} has no access to delete this lobby`);
  }
  const successfullyDeleted = lobbyRepository.delete(lobbyId);
  if (!successfullyDeleted) {
    throw Error("Error during calling delete on lobbys");
  }
};
