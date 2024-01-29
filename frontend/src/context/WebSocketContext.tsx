import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { EmitFunctionProps, SocketClient } from "../socket/Socket.ts";
import {
  DataFromEventCallback,
  EventsFromServer,
  EventsFromServerKeys,
  EventsToServerKeys,
} from "../../../shared/types/websocket.ts";
import { useAuth } from "./AuthContext.tsx";

type WebSocketState = {
  client: SocketClient | null;
  ping: number;
};

const WebSocketContext = createContext({} as WebSocketState);

type WebSocketProviderProps = {
  children: ReactNode;
};
const BACKEND_URL = import.meta.env.VITE_API_URL ?? "http://localhost";

export const WebSocketProvider: FC<WebSocketProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<SocketClient | null>(null);
  const [ping, setPing] = useState(0);

  useEffect(() => {
    if (user && !socket) {
      setSocket(new SocketClient(BACKEND_URL, user.uid, { pingCallback: setPing }));
    }

    return () => {
      if (socket) {
        socket.cleanup();
        setSocket(null);
      }
    };
  }, [user, socket]);

  return <WebSocketContext.Provider value={{ client: socket, ping }}>{children}</WebSocketContext.Provider>;
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
  const { client } = useSocket();

  const [data, setData] = useState<DataFromEventCallback<EventsFromServer[KeyOfEventsFromServer]> | undefined>();

  useEffect(() => {
    client?.subscribe(eventName, setData, autoFireEvent);

    return () => {
      client?.unsubscribe(eventName, setData);
    };
  }, [client]);

  return [data];
};
