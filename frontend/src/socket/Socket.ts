import { io, Socket } from "socket.io-client";
import {
  DataFromEventCallback,
  EventsFromServer,
  EventsFromServerKeys,
  EventsToServer,
  EventsToServerKeys,
} from "../../../shared/types/websocket.ts";
import { FECreateLobbyProps } from "../../../shared/types/lobby.ts";
import { PingService } from "./PingService.ts";

export type WebSocketSubscriber = {
  eventName: EventsFromServerKeys;
  callback: (...args: any[]) => void;
};

export type SocketClientCallbacks = {
  pingCallback: (ping: number) => void;
};

export class SocketClient {
  private socket: Socket<EventsFromServer, EventsToServer>;
  private clientId: string;
  private subscribers: WebSocketSubscriber[] = [];
  private pingService: PingService;

  constructor(uri: string, clientId: string, callbacks: SocketClientCallbacks) {
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

    this.socket.on("PONG", (data) => this.pingService.handlePong(data.pongId, callbacks.pingCallback));

    this.pingService = new PingService(this);
  }

  joinLobby(lobbyId: string): void {
    this.socket.emit("JOIN_LOBBY", { lobbyId });
  }

  async createLobby(data: FECreateLobbyProps): Promise<string> {
    return new Promise((resolve, reject) => {
      this.socket.emit("CREATE_LOBBY", data, (response) => {
        if (response.lobbyId) {
          resolve(response.lobbyId);
        } else {
          reject(new Error("Couldn't create lobby"));
        }
      });
    });
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

    if (emit) {
      // @ts-ignore
      this.socket.emit(emit?.eventName, emit?.data);
    }
  }

  unsubscribe(event: keyof EventsFromServer, callback: (...args: any[]) => void) {
    this.socket.off(event, callback);
    this.subscribers = this.subscribers.filter((subscriber) => subscriber.callback !== callback);
  }

  cleanup() {
    this.pingService.cleanup();
    this.socket.disconnect();
    console.log(`Disconnecting ${this.clientId}`);
  }

  emitPing(pingId: string) {
    this.socket.emit("PING", { pingId });
  }
}

export type EmitFunctionProps<T extends EventsToServerKeys> = {
  eventName: T;
  data: DataFromEventCallback<EventsToServer[T]>;
};
export type EmitFunctionType = <T extends EventsToServerKeys>(props: EmitFunctionProps<T>) => void;
