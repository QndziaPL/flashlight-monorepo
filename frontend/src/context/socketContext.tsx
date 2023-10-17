import { createContext, ReactNode, useContext, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext({} as SocketContextValue);

export const useSocket = () => useContext(SocketContext);

export type SocketContextValue = {
  socket: Socket;
};

export const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const { current: socket } = useRef(io("http://localhost:8080"));

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
