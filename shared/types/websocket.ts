import { FECreateLobbyProps, LobbyDTO } from "./lobby";
import { IChatMessage, IChatMessageClient } from "./chat";

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

type EventCallback<T> = (props: T) => void;
type EventCallbackWithCallback<TProps, TResponse> = (
  props: TProps,
  callback: (data: TResponse) => void,
) => Promise<void>;

export type EventsToServer = {
  CHAT_MESSAGE: EventCallback<IChatMessageClient>;
  JOIN_LOBBY: EventCallback<{
    lobbyId: string;
  }>;
  LEAVE_LOBBY: EventCallback<{
    lobbyId: string;
  }>;
  CREATE_LOBBY: EventCallbackWithCallback<
    FECreateLobbyProps,
    {
      lobbyId: string;
    }
  >;
  GET_LOBBY_LIST: EventCallback<undefined>;
  PING: EventCallback<{
    pingId: string;
  }>;
  DELETE_LOBBY: EventCallback<{
    lobbyId: string;
  }>;
} & SocketReservedEvents;

export type EventsToServerKeys = keyof EventsToServer;

export type EventsFromServer = {
  CHAT_MESSAGE: EventCallback<IChatMessage>;
  INFO_MESSAGE: EventCallback<InfoMessage>;
  LOBBY_LIST: EventCallback<LobbyDTO[]>;
  LOBBY_DELETED: EventCallback<{
    lobbyId: string;
  }>;
  LOBBY_LEFT: EventCallback<{
    lobbyId: string;
  }>;
  ERROR_MESSAGE: EventCallback<ErrorMesssage>;
  PONG: EventCallback<{
    pongId: string;
  }>;
} & SocketReservedEvents;

export type EventsFromServerKeys = keyof EventsFromServer;

export type DataFromEventCallback<Callback> = Callback extends EventCallback<infer Data> ? Data : never;

export enum InfoMessageType {
  GENERAL = "general",
}

export type InfoMessage = {
  message: string;
  type: InfoMessageType;
  id: string;
};

export enum ErrorMessageType {
  GENERAL = "general",
}

export type ErrorMesssage = {
  message: string;
  type: ErrorMessageType;
  id: string;
};
