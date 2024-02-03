import { Socket } from "../WebSocketService/WebSocketService";
import { ErrorMessageType, InfoMessageType } from "../../../../shared/types/websocket";
import { v4 } from "uuid";
import { LobbyRepository } from "../../../repositories/LobbyRepository";

export const handleJoinLobby = async (
  lobbyId: string,
  clientId: string,
  lobbyRepository: LobbyRepository,
  socket: Socket,
  onSuccessCallback: () => void,
) => {
  try {
    joinLobby(lobbyId, clientId, lobbyRepository);
    await socket.join(lobbyId);
    const infoMessage = `Client with id: ${clientId} joined "${lobbyId}" lobby and ws-room with same id`;
    socket.to(lobbyId).emit("INFO_MESSAGE", { type: InfoMessageType.GENERAL, message: infoMessage, id: v4() });
    onSuccessCallback();
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error...";
    socket.emit("ERROR_MESSAGE", { type: ErrorMessageType.GENERAL, message: errorMessage, id: v4() });
  }
};

const joinLobby = (lobbyId: string, clientId: string, lobbyRepository: LobbyRepository) => {
  const lobby = lobbyRepository.getById(lobbyId);
  if (!lobby) {
    throw Error(`Couldn't find lobby with id ${lobbyId}`);
  }
  if (lobby.clients.includes(clientId)) {
    throw Error(`Client with id ${clientId} is already on client list in ${lobbyId} lobby`);
  }
  lobby.addClient(clientId);
};
