import { io, Socket } from "socket.io-client";
import { WSEvent } from "../../../shared/types/websocket.ts";
import { webRTCClient } from "../RTC/RTC.ts";

export class SocketClient {
  socket: Socket;
  clientId: string | undefined;

  constructor(uri: string) {
    this.socket = io(uri);

    this.socket.on("connect", () => {
      console.log("front podłączony");
    });
    this.socket.on(WSEvent.INFO_MESSAGE, (msg) => console.log(msg));
    this.socket.on(WSEvent.RTC_ANSWER, async (RTCAnswer) => {
      console.log("SIEMA KURWA ENIU", JSON.stringify(RTCAnswer));
      try {
        const isWaitingForAnswer = webRTCClient.signalingState === "have-local-offer";
        console.log(`Received RTC answer. Signaling state: ${webRTCClient.signalingState}`);
        if (true || isWaitingForAnswer) {
          await webRTCClient.setRemoteDescriptionAndHandleICE(RTCAnswer);
        }
      } catch (error) {
        console.error("Error handling RTC answer:", error);
      }
    });

    this.socket.on(WSEvent.ICE_CANDIDATE, async (candidate) => {
      try {
        await webRTCClient.addIceCandidate(candidate);
      } catch (error) {
        console.error(
          `Error adding ICE candidate. candidate: ${JSON.stringify(candidate)}. Error: ${JSON.stringify(error)}`,
        );
      }
    });

    this.socket.emit("FE_CONNECTED", "FE podłączony");
  }

  joinRoom(roomName: string, RTCAnswer?: RTCSessionDescriptionInit): void {
    if (this.clientId) {
      console.log(`RTCAnswer in Socket.joinRoom: ${JSON.stringify(RTCAnswer)}`);
      this.socket.emit(WSEvent.JOIN_ROOM, { clientId: this.clientId, roomName, RTCAnswer });
    }
  }

  setClientId(clientId: string) {
    console.log("Setting clientId for client socket instance");
    this.clientId = clientId;
  }

  emit(ev: string, ...args: any[]) {
    this.socket.emit(ev, ...args);
  }

  on(ev: string, listener: (...args: any[]) => void) {
    this.socket.on(ev, listener);
  }
}

const BACKEND_URL = import.meta.env.VITE_API_URL ?? "http://localhost";
export const socket = new SocketClient(BACKEND_URL);
// export const socket = new SocketClient("http://localhost");
