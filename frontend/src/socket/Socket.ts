import { io, Socket } from "socket.io-client";
import {
  DataFromEventCallback,
  EventsFromServer,
  EventsFromServerKeys,
  EventsToServer,
  EventsToServerKeys,
} from "../../../shared/types/websocket.ts";

export type WebSocketSubscriber = {
  eventName: EventsFromServerKeys;
  callback: (...args: any[]) => void;
};

export class SocketClient {
  private socket: Socket<EventsFromServer, EventsToServer>;
  private clientId: string;
  private subscribers: WebSocketSubscriber[] = [];

  constructor(uri: string, clientId: string) {
    this.socket = io(uri);
    this.clientId = clientId;

    this.socket.on("connect", () => {
      console.log("Client connected");
    });

    this.socket.on("INFO_MESSAGE", async (msg) => {
      console.log(msg);
    });
  }

  joinRoom(roomName: string): void {
    if (this.clientId) {
      this.socket.emit("JOIN_ROOM", { room: roomName, clientId: this.clientId });
    }
  }

  setClientId(clientId: string) {
    console.log("Setting clientId for client socket instance");
    this.clientId = clientId;
  }

  emit: EmitFunctionType = ({ eventName, data }) => {
    // @ts-ignore
    this.socket.emit(eventName, data);
    console.log(`Emit send with '${eventName}' eventName`);
  };

  subscribe<T extends EventsToServerKeys>(
    eventName: EventsFromServerKeys,
    callback: (...args: any[]) => void,
    emit?: EmitFunctionProps<T>,
  ) {
    this.socket.on<EventsFromServerKeys>(eventName, callback);
    this.subscribers.push({ eventName, callback });
    console.log(this.subscribers);

    if (emit) {
      // @ts-ignore
      this.socket.emit(emit?.eventName, emit?.data);
    }
  }

  unsubscribe(event: keyof EventsFromServer, callback: (...args: any[]) => void) {
    this.socket.off(event, callback);
    this.subscribers = this.subscribers.filter((subscriber) => subscriber.callback !== callback);
  }
}

export type EmitFunctionProps<T extends EventsToServerKeys> = {
  eventName: T;
  data: DataFromEventCallback<EventsToServer[T]>;
};
export type EmitFunctionType = <T extends EventsToServerKeys>(props: EmitFunctionProps<T>) => void;
