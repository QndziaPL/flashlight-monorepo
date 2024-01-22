import { createContext, FC, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { EmitFunctionProps, SocketClient } from "../socket/Socket.ts";
import { useAppContext } from "./AppContext.tsx";
import {
  DataFromEventCallback,
  EventsFromServer,
  EventsFromServerKeys,
  EventsToServerKeys,
} from "../../../shared/types/websocket.ts";

type WebSocketState = SocketClient | null;

const WebSocketContext = createContext({} as WebSocketState);

type WebSocketProviderProps = {
  children: ReactNode;
};
const BACKEND_URL = import.meta.env.VITE_API_URL ?? "http://localhost";

export const WebSocketProvider: FC<WebSocketProviderProps> = ({ children }) => {
  const { clientId } = useAppContext();
  const socketRef = useRef<SocketClient | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    socketRef.current = new SocketClient(BACKEND_URL, clientId);
    setInitialized(true);
  }, []);

  return <WebSocketContext.Provider value={socketRef.current}>{initialized && children}</WebSocketContext.Provider>;
};

export const useSocket = () => {
  const socket = useContext(WebSocketContext);

  if (!socket) throw Error("socket client not initialised");

  return socket;
};

type SocketSubscriptionProps<T extends EventsToServerKeys> = {
  eventName: EventsFromServerKeys;
  autoFireEvent?: EmitFunctionProps<T>;
};

export const useSocketSubscription = <
  KeyOfEventsFromServer extends EventsFromServerKeys,
  AutoFireEvent extends EventsToServerKeys,
>({
  eventName,
  autoFireEvent,
}: SocketSubscriptionProps<AutoFireEvent>): [
  DataFromEventCallback<EventsFromServer[KeyOfEventsFromServer]> | undefined,
] => {
  const socket = useSocket();

  const [data, setData] = useState<DataFromEventCallback<EventsFromServer[KeyOfEventsFromServer]> | undefined>();

  useEffect(() => {
    socket.subscribe(eventName, setData, autoFireEvent);

    return () => {
      socket.unsubscribe(eventName, setData);
    };
  }, []);

  return [data];
};
