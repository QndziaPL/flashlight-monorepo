import { Server } from "socket.io";

export const closeSocketRoom = (io: Server, lobbyId: string, particularSocketId?: string) => {
  const room = io.sockets.adapter.rooms.get(lobbyId);
  if (!room) {
    throw Error("Couldn't get room when trying to leave it");
  }

  if (particularSocketId) {
    const socket = io.sockets.sockets.get(particularSocketId);
    if (!socket) {
      throw Error("Couldn't get socket when trying to leave room");
    }
    socket.leave(lobbyId);
    return;
  }

  for (const socketId of room) {
    const socket = io.sockets.sockets.get(socketId);
    if (!socket) {
      throw Error("Couldn't get socket when trying to leave room");
    }
    socket.leave(lobbyId);
  }
};
