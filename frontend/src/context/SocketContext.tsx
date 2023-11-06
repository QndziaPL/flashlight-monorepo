import { createContext, ReactNode, useCallback, useContext, useEffect, useRef } from "react";
import { io as socketIo, Socket } from "socket.io-client";
import { WSEvent } from "../../../shared/types/websocket.ts";
import { useAppContext } from "./AppContext.tsx";

const SocketContext = createContext({} as SocketContextProps);

export const useSocket = () => useContext(SocketContext);

export type SocketContextProps = {
  socket: Socket;
  joinRoom: (roomName: string) => void;
};

export const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const { clientId } = useAppContext();
  //todo: adres do ustawienia z enva (prod dla azure, dev localhost)
  const { current: socket } = useRef(socketIo("http://localhost"));

  useEffect(() => {
    fetch("http://localhost:80").then((d) => console.log(d));
  }, []);

  socket.on("connect", () => {
    console.log("front podłączony");
  });
  console.log("dupsko");
  socket.on(WSEvent.INFO_MESSAGE, console.log);

  socket.emit("FE_CONNECTED", "FE podłączony");

  const joinRoom = useCallback(
    (roomName: string) => {
      socket.emit(WSEvent.JOIN_ROOM, { clientId, roomName });
    },
    [socket, clientId],
  );

  return <SocketContext.Provider value={{ socket: socket, joinRoom }}>{children}</SocketContext.Provider>;
};
