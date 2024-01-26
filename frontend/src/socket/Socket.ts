import { io, Socket } from "socket.io-client";
import {
  DataFromEventCallback,
  EventsFromServer,
  EventsFromServerKeys,
  EventsToServer,
  EventsToServerKeys,
} from "../../../shared/types/websocket.ts";
import { FECreateLobbyProps } from "../../../shared/types/lobby.ts";

export type WebSocketSubscriber = {
  eventName: EventsFromServerKeys;
  callback: (...args: any[]) => void;
};

export class SocketClient {
  private socket: Socket<EventsFromServer, EventsToServer>;
  private clientId: string;
  private subscribers: WebSocketSubscriber[] = [];

  constructor(uri: string, clientId: string) {
    this.socket = io(uri, {
      auth: {
        clientId,
      },
    });
    this.clientId = clientId;

    this.socket.on("connect", () => {
      console.log(`Client ${clientId} established connection with backend ws`);
    });

    this.socket.on("INFO_MESSAGE", async (msg) => {
      console.log(msg);
    });
  }

  joinLobby(lobbyId: string): void {
    this.socket.emit("JOIN_LOBBY", { lobbyId });
  }

  createLobby(data: FECreateLobbyProps) {
    this.socket.emit("CREATE_LOBBY", data);
  }

  setClientId(clientId: string) {
    console.log("Setting clientId for client socket instance");
    this.clientId = clientId;
  }

  private emit: EmitFunctionType = ({ eventName, data }) => {
    console.log("LECI");
    // @ts-ignore
    this.socket.emit(eventName, data);
    console.log(`Emit send with '${eventName}' eventName`);
  };

  //TODO: consider adding emitWithCallback so i can verify if i can proceed (for example after creating lobby if i should go to lobby list)

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

  disconnect() {
    this.socket.disconnect();
    console.log(`Disconnecting ${this.clientId}`);
  }
}

export type EmitFunctionProps<T extends EventsToServerKeys> = {
  eventName: T;
  data: DataFromEventCallback<EventsToServer[T]>;
};
export type EmitFunctionType = <T extends EventsToServerKeys>(props: EmitFunctionProps<T>) => void;
