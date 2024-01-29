import { Server } from "socket.io";

export const closeSocketRoom = (io: Server, lobbyId: string) => {
  const room = io.sockets.adapter.rooms.get(lobbyId);
  if (!room) {
    throw Error("Couldn't get room when trying to delete it");
  }

  for (const socketId of room) {
    const socket = io.sockets.sockets.get(socketId);
    if (!socket) {
      throw Error("Couldn't get socket when trying to delete room");
    }
    socket.leave(lobbyId);
  }
};
