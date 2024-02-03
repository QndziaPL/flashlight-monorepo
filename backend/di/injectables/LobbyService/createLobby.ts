import { ErrorMessageType, InfoMessageType } from "../../../../shared/types/websocket";
import { v4 as uuid, v4 } from "uuid";
import { CreateLobbyProps, FECreateLobbyProps } from "../../../../shared/types/lobby";
import { Lobby } from "../../../lobby/Lobby";
import { Socket } from "../WebSocketService/WebSocketService";
import { LobbyRepository } from "../../../repositories/LobbyRepository";

export const handleCreateLobby = async (
  lobbyData: FECreateLobbyProps,
  callback: (data: { lobbyId: string }) => void,
  lobbyRepository: LobbyRepository,
  clientId: string,
  socket: Socket,
  emitLobbyList: () => void,
) => {
  try {
    const lobbyId = createLobby(
      {
        ...lobbyData,
        clients: [clientId],
        createdAt: Date.now(),
        hostId: clientId,
      },
      lobbyRepository,
    );
    await socket.join(lobbyId);
    emitLobbyList();
    const infoMessage = `You successfully created lobby`;
    socket.emit("INFO_MESSAGE", { type: InfoMessageType.GENERAL, message: infoMessage, id: v4() });
    callback({ lobbyId });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error...";
    socket.emit("ERROR_MESSAGE", { type: ErrorMessageType.GENERAL, message: errorMessage, id: v4() });
  }
};

const createLobby = (data: CreateLobbyProps, lobbyRepository: LobbyRepository) => {
  if (lobbyRepository.getAll().some((lobby) => lobby.clients.includes(data.hostId))) {
    throw Error(`Couldn't create lobby. Client ${data.hostId} is already part of an other lobby`);
  }
  const id = uuid();
  const newLobby = new Lobby(id, data.name, data.hostId, data.clients, data.createdAt);
  lobbyRepository.add(id, newLobby);
  return id;
};
