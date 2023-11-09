import { WSEvent } from "../../../shared/types/websocket.ts";
import { RTCEventType } from "../../../shared/types/rtc.ts";
import { socket } from "../socket/Socket.ts";

class WebRTCClient {
  configuration: RTCConfiguration;
  connection: RTCPeerConnection;
  dataChannel: RTCDataChannel | null = null;

  constructor(config: RTCConfiguration) {
    this.configuration = config;
    this.connection = new RTCPeerConnection(this.configuration);

    this.connection.onicecandidate = (event) => {
      console.log("ON_ICE_CANDIDATE_EVENT");
      if (event.candidate) {
        console.log(`ON_ICE_CANDIDATE_EVENT - sending ICE CANDIDATE, candidate: ${JSON.stringify(event.candidate)}`);
        // Send the ICE candidate to the other peer using your signaling channel
        // Example: socket.emit("ice-candidate", event.candidate);
        socket.emit(WSEvent.ICE_CANDIDATE, event.candidate);
      }
    };

    // this.connection.onnegotiationneeded;

    this.connection.oniceconnectionstatechange = (event) => {
      console.log(
        `ON ICE CONNECTION STATE CHANGE. state: ${this.connection.iceConnectionState}, event: ${JSON.stringify(event)}`,
      );
      if (this.connection.iceConnectionState === "connected") {
        console.log("MAMY KURWA POŁĄCZENIE!!!!!!!!!!!!!!!!!!!!!");
      }
    };

    this.connection.ondatachannel = (event) => {
      console.log(event);
      const dataChannel = event.channel;
      if (!this.dataChannel) {
        this.dataChannel = dataChannel;
      }
      this.dataChannel.onopen = () => {
        console.log("CHANNEL OPENED ON JOINER");
        console.log(`CURRENT CHANNEL: ${this.dataChannel?.label}`);
      };

      this.dataChannel.onmessage = (event) => {
        console.log(event.data);
      };
    };
  }

  sendMessage(rtcEventType: RTCEventType, message: unknown) {
    const data = { eventType: rtcEventType, message };
    this.dataChannel?.send(JSON.stringify(data));
  }

  // Getter method to access the WebRTC configuration
  getConfiguration() {
    return this.configuration;
  }

  // Setter method to modify the WebRTC configuration
  setConfiguration(newConfig: RTCConfiguration) {
    this.configuration = { ...this.configuration, ...newConfig };
  }

  async createOffer() {
    try {
      const dataChannel = this.connection.createDataChannel("TestDataChannel");
      dataChannel.addEventListener("open", (event) => {
        console.log(event);
      });
      this.dataChannel = dataChannel;
      await this.connection.setLocalDescription();
      const description = this.connection.localDescription;

      if (!description) throw Error("No description during creating offer");

      return description;
    } catch (error) {
      console.error(error);
    }
  }

  async createAnswer(offer?: RTCSessionDescriptionInit) {
    if (!offer) throw new Error("No offer");
    try {
      await this.connection.setRemoteDescription(offer);
      const answer = await this.connection.createAnswer();
      await this.connection.setLocalDescription(answer);
      const answerFromLocalDescription = this.connection.localDescription;
      if (!answerFromLocalDescription) {
        throw Error(`Answer from localDescription not obtained`);
      }
      return answerFromLocalDescription;
    } catch (error) {
      console.error(error);
    }
  }

  async setRemoteDescriptionAndHandleICE(remoteDescription: RTCSessionDescriptionInit) {
    try {
      await this.connection.setRemoteDescription(remoteDescription);
    } catch (error) {
      console.error("Error setting remote description:", error);
    }
  }

  async addIceCandidate(candidate: RTCIceCandidateInit) {
    console.log("ICE CANDIDATE");
    await this.connection.addIceCandidate(candidate);
  }

  public get signalingState(): RTCSignalingState {
    return this.connection.signalingState;
  }
}

const rtcConfiguration: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
export const webRTCClient = new WebRTCClient(rtcConfiguration);
