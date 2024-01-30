import { IChatMessageClient } from "../../../../shared/types/chat";
import { LobbyService } from "./LobbyService";
import { Socket } from "../WebSocketService/WebSocketService";
import { ErrorMessageType } from "../../../../shared/types/websocket";
import { v4 } from "uuid";

export const handleChatMessage = async (
  message: IChatMessageClient,
  lobbyService: LobbyService,
  clientId: string,
  socket: Socket,
) => {
  try {
    const lobby = lobbyService.getLobbyById(message.lobbyId);
    const newMessage = lobby.addMessage(message, clientId);
    console.log(lobby.flatData.id, message.lobbyId);
    const poszlo = lobbyService.io.to(lobby.flatData.id).emit("CHAT_MESSAGE", newMessage);
    console.log(poszlo);
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error...";
    socket.emit("ERROR_MESSAGE", { type: ErrorMessageType.GENERAL, message: errorMessage, id: v4() });
  }
};
