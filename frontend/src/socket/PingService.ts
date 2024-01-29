import { v4 } from "uuid";
import { SocketClient } from "./Socket.ts";

const PING_FREQUENCY = 1000;

export class PingService {
  private intervalId: NodeJS.Timer | number | null = null;
  private pingId = "";
  private pingTimestamp = 0;

  private socket: SocketClient;

  constructor(socket: SocketClient) {
    this.socket = socket;
    this.startMeasuring();
  }

  startMeasuring() {
    if (this.intervalId === null) {
      this.intervalId = setInterval(() => {
        this.pingId = v4();
        this.pingTimestamp = Date.now();
        this.socket.emitPing(this.pingId);
      }, PING_FREQUENCY);
    }
  }

  handlePong(pongId: string, callback: (ping: number) => void) {
    if (pongId === this.pingId) {
      const pongTimestamp = Date.now();
      const ping = pongTimestamp - this.pingTimestamp;
      callback(ping);
    }
  }

  cleanup() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId as any);
      this.intervalId = null;
      console.log("Clearing interval in PingService");
    }
  }
}
