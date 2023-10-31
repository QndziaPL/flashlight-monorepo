import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext({} as SocketContextProps);

export const useSocket = () => useContext(SocketContext);

export type SocketContextProps = {
  socket: Socket;
};

export const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  //todo: adres do ustawienia z enva (prod dla azure, dev localhost)
  const { current: socket } = useRef(io("http://localhost"));

  useEffect(() => {
    fetch("http://localhost:80").then((d) => console.log(d));
  }, []);

  console.log(socket);
  socket.on("connect", () => {
    console.log("front podłączony");
  });
  socket.emit("FE_CONNECTED", "FE podłączony");

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
