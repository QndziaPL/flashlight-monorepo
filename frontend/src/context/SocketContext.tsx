import { createContext, ReactNode, useCallback, useContext, useEffect } from "react";
import { io as socketIo, Socket } from "socket.io-client";
import { WSEvent } from "../../../shared/types/websocket.ts";
import { useAppContext } from "./AppContext.tsx";
import webRTCClient from "../RTC/RTC.ts";

const SocketContext = createContext({} as SocketContextProps);

export const useSocketContext = () => useContext(SocketContext);

//TODO: CAŁE DO WYPIERDOLENIA, ZROBIĆ KLASĘ ALBO WYSTARCZY SINGLETON/GLOBAL PÓKI CO
export type SocketContextProps = {
  socket: Socket;
  joinRoom: (roomName: string, RTCAnswer?: RTCSessionDescriptionInit) => void;
};

export const socket = socketIo("http://localhost");

export const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const { clientId } = useAppContext();
  //todo: adres do ustawienia z enva (prod dla azure, dev localhost)
  // const [socket] = useState(socketIo("http://localhost"));

  useEffect(() => {
    socket.on("connect", () => {
      console.log("front podłączony");
    });
    socket.on(WSEvent.INFO_MESSAGE, console.log);
    socket.on(WSEvent.RTC_ANSWER, async (RTCAnswer) => {
      const isWaitingForAnswer = webRTCClient.signalingState === "have-local-offer";

      if (isWaitingForAnswer) {
        await webRTCClient.setRemoteDescriptionAndHandleICE(RTCAnswer);
      }
    });

    socket.on(WSEvent.ICE_CANDIDATE, (candidate) => webRTCClient.addIceCandidate(candidate));

    socket.emit("FE_CONNECTED", "FE podłączony");
  }, []);

  const joinRoom = useCallback(
    (roomName: string, RTCAnswer?: RTCSessionDescriptionInit) => {
      socket.emit(WSEvent.JOIN_ROOM, { clientId, roomName, RTCAnswer });
    },
    [clientId],
  );

  return <SocketContext.Provider value={{ socket, joinRoom }}>{children}</SocketContext.Provider>;
};
