import { SocketClient } from "../../frontend/src/socket/Socket";
import { FECreateLobbyProps, ILobby } from "./lobby";

export type DisconnectReason =
  | "io server disconnect"
  | "io client disconnect"
  | "ping timeout"
  | "transport close"
  | "transport error"
  | "parse error";

export type DisconnectDescription =
  | Error
  | {
      description: string;
      context?: unknown;
    };

export interface SocketReservedEvents {
  connect: () => void;
  connect_error: (err: Error) => void;
  disconnect: (reason: DisconnectReason, description?: DisconnectDescription) => void;
}

export type IChatMessage = {
  text: string;
  author: string;
  timestamp: number;
  room: string;
};

export type IChatMessageClient = Pick<IChatMessage, "text" | "author">;

type EventCallback<T> = (props: T) => void;

export type EventsToServer = {
  CHAT_MESSAGE: EventCallback<IChatMessageClient>;
  JOIN_ROOM: EventCallback<{ clientId: SocketClient["clientId"]; room: string }>;
  CREATE_LOBBY: EventCallback<FECreateLobbyProps>;
  GET_LOBBY_LIST: EventCallback<undefined>;
} & SocketReservedEvents;

export type EventsToServerKeys = keyof EventsToServer;

export type EventsFromServer = {
  CHAT_MESSAGE: EventCallback<IChatMessage>;
  INFO_MESSAGE: EventCallback<string>;
  LOBBY_LIST: EventCallback<ILobby[]>;
} & SocketReservedEvents;

export type EventsFromServerKeys = keyof EventsFromServer;

export type DataFromEventCallback<Callback> = Callback extends EventCallback<infer Data> ? Data : never;
