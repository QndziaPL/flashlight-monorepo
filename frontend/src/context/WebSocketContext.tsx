import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { EmitFunctionProps, SocketClient } from "../socket/Socket.ts";
import {
  DataFromEventCallback,
  EventsFromServer,
  EventsFromServerKeys,
  EventsToServerKeys,
} from "../../../shared/types/websocket.ts";
import { useAuth } from "./AuthContext.tsx";

type WebSocketState = SocketClient | null;

const WebSocketContext = createContext({} as WebSocketState);

type WebSocketProviderProps = {
  children: ReactNode;
};
const BACKEND_URL = import.meta.env.VITE_API_URL ?? "http://localhost";

export const WebSocketProvider: FC<WebSocketProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<SocketClient | null>(null);

  useEffect(() => {
    if (user) {
      setSocket(new SocketClient(BACKEND_URL, user.uid));
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  return <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>;
};

export const useSocket = () => useContext(WebSocketContext);

type SocketSubscriptionProps<T extends EventsToServerKeys> = {
  eventName: EventsFromServerKeys;
  autoFireEvent?: EmitFunctionProps<T>;
};

export const useSocketSubscription = <
  KeyOfEventsFromServer extends EventsFromServerKeys,
  AutoFireEvent extends EventsToServerKeys = never,
>({
  eventName,
  autoFireEvent,
}: SocketSubscriptionProps<AutoFireEvent>): [
  DataFromEventCallback<EventsFromServer[KeyOfEventsFromServer]> | undefined,
] => {
  const socket = useSocket();

  const [data, setData] = useState<DataFromEventCallback<EventsFromServer[KeyOfEventsFromServer]> | undefined>();

  useEffect(() => {
    socket?.subscribe(eventName, setData, autoFireEvent);

    return () => {
      socket?.unsubscribe(eventName, setData);
    };
  }, [socket]);

  return [data];
};
