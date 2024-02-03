import { IChatMessageClient } from "../../../../shared/types/chat";
import { Socket, SocketIOServer } from "../WebSocketService/WebSocketService";
import { ErrorMessageType } from "../../../../shared/types/websocket";
import { v4 } from "uuid";
import { LobbyRepository } from "../../../repositories/LobbyRepository";

export const handleChatMessage = async (
  message: IChatMessageClient,
  lobbyRepository: LobbyRepository,
  clientId: string,
  socket: Socket,
  io: SocketIOServer,
) => {
  try {
    const lobby = lobbyRepository.getById(message.lobbyId);
    if (!lobby) {
      throw Error(`Couldn't find lobby with id ${message.lobbyId}`);
    }
    const newMessage = lobby.addMessage(message, clientId);
    io.to(lobby.getDto.id).emit("CHAT_MESSAGE", newMessage);
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error...";
    socket.emit("ERROR_MESSAGE", { type: ErrorMessageType.GENERAL, message: errorMessage, id: v4() });
  }
};
