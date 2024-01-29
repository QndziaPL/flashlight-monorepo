import { Server, Socket as _Socket } from "socket.io";
import { EventsFromServer, EventsToServer } from "../../../../shared/types/websocket";
import { ClientsService } from "../../../services/ClientsService/ClientsService";
import { ServerService } from "../ServerService/ServerService";
import { inject, injectable } from "inversify";
import { INJECTABLE_TYPES } from "../types";
import { IWithIO } from "../../../interfaces/interfaces";

export type SocketIOServer = Server<EventsToServer, EventsFromServer>;
export type Socket = _Socket<EventsToServer, EventsFromServer>;

@injectable()
export class WebSocketService implements IWithIO {
  private readonly _io: SocketIOServer;
  private players: ClientsService = new ClientsService();

  constructor(@inject(INJECTABLE_TYPES.ServerService) private readonly serverService: ServerService) {
    this._io = new Server<EventsToServer, EventsFromServer>(serverService.server, {
      cors: { origin: "*" },
    });

    this.initializeEvents();
  }

  get io() {
    return this._io;
  }

  initializeEvents(): void {
    this._io.on("connection", (socket) => {
      const clientId = socket.handshake.auth.clientId;
      console.log(`Connected WS client ${clientId} - WebSocketService`);

      socket.on("PING", async (data) => {
        // await delay(123);
        socket.emit("PONG", { pongId: data.pingId });
      });
    });
  }
}
