import { Socket, SocketIOServer } from "../WebSocketService/WebSocketService";
import { ErrorMessageType, InfoMessageType } from "../../../../shared/types/websocket";
import { v4 } from "uuid";
import { closeSocketRoom } from "../WebSocketService/closeSocketRoom";
import { LobbyRepository } from "../../../repositories/LobbyRepository";

export const handleLeaveLobby = (
  lobbyId: string,
  clientId: string,
  lobbyRepository: LobbyRepository,
  socket: Socket,
  deleteLobby: (lobbyId: string, clientId: string, socket: Socket, io: SocketIOServer) => void,
  io: SocketIOServer,
  emitLobbyList: () => void,
) => {
  try {
    const lobby = leaveLobby(lobbyId, clientId, lobbyRepository);
    if (!lobby.clients.length) {
      deleteLobby(lobbyId, clientId, socket, io);
      return;
    }
    const infoMessage = `Player ${clientId} left "${lobbyRepository.getById(lobbyId)?.getDto.name}" lobby`;
    socket.to(lobbyId).emit("INFO_MESSAGE", { type: InfoMessageType.GENERAL, message: infoMessage, id: v4() });
    closeSocketRoom(io, lobbyId, socket.id);
    emitLobbyList();
    socket.emit("LOBBY_LEFT", { lobbyId });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error...";
    socket.emit("ERROR_MESSAGE", { type: ErrorMessageType.GENERAL, message: errorMessage, id: v4() });
  }
};

const leaveLobby = (lobbyId: string, clientId: string, lobbyRepository: LobbyRepository) => {
  const lobby = lobbyRepository.getById(lobbyId);
  if (!lobby) {
    throw Error(`Couldn't find lobby with id ${lobbyId}`);
  }
  if (!lobby.clients.includes(clientId)) {
    throw Error(`We couldn't find you in this lobby`);
  }
  lobby.removeClient(clientId);
  return lobby;
};
