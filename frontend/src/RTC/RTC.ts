import { WSEvent } from "../../../shared/types/websocket.ts";
import { RTCEventType } from "../../../shared/types/rtc.ts";
import { socket } from "../socket/Socket.ts";
import { PlayerChat, PlayerChatMessage } from "./PlayerChat.ts";
import { v4 as uuid } from "uuid";

export type SubscriberCallback<T> = (data: T) => void;
export type Subscribers<T> = Map<SubscriberCallback<T>, SubscriberCallback<T>>;
export type RTCSubscribers = {
  chat: Subscribers<PlayerChatMessage[]>;
  iceConnectionState: Subscribers<RTCIceConnectionState>;
};

type ExtractSubscribersType<T> = T extends Subscribers<infer U> ? U : never;

type CallbackForSubscribeMethod<TypeOfSubscription extends keyof RTCSubscribers> = SubscriberCallback<
  ExtractSubscribersType<RTCSubscribers[TypeOfSubscription]>
>;

type SubscribeCallbackDataType<Callback> = Callback extends SubscriberCallback<infer Data> ? Data : never;

export const initialSubscribers: RTCSubscribers = {
  chat: new Map<SubscriberCallback<PlayerChatMessage[]>, SubscriberCallback<PlayerChatMessage[]>>(),
  iceConnectionState: new Map<SubscriberCallback<RTCIceConnectionState>, SubscriberCallback<RTCIceConnectionState>>(),
};

class WebRTCClient {
  configuration: RTCConfiguration;
  connection: RTCPeerConnection;
  dataChannel: RTCDataChannel | null = null;
  playerChat: PlayerChat;
  subscribers: RTCSubscribers;

  constructor(config: RTCConfiguration) {
    this.subscribers = initialSubscribers;
    this.playerChat = new PlayerChat();
    this.configuration = config;
    this.connection = new RTCPeerConnection(this.configuration);

    this.connection.onicecandidate = (event) => {
      console.log("ON_ICE_CANDIDATE_EVENT");
      if (event.candidate) {
        console.log(`ON_ICE_CANDIDATE_EVENT - sending ICE CANDIDATE, candidate: ${JSON.stringify(event.candidate)}`);
        socket.emit(WSEvent.ICE_CANDIDATE, event.candidate);
      }
    };

    this.connection.oniceconnectionstatechange = (event) => {
      console.log(
        `ON ICE CONNECTION STATE CHANGE. state: ${this.connection.iceConnectionState}, event: ${JSON.stringify(event)}`,
      );
      this.notify("iceConnectionState", this.connection.iceConnectionState);
      if (this.connection.iceConnectionState === "connected") {
        console.log("MAMY KURWA POŁĄCZENIE!!!!!!!!!!!!!!!!!!!!!");
      }
    };

    this.connection.ondatachannel = (event) => {
      const dataChannel = event.channel;
      this.applyDataChannelSubscription(dataChannel);
    };
  }

  get iceConnectionState(): RTCIceConnectionState {
    return this.connection.iceConnectionState;
  }

  applyDataChannelSubscription(channel: RTCDataChannel) {
    channel.onopen = () => {
      console.log("CHANNEL OPENED ON JOINER");
      console.log(`CURRENT CHANNEL: ${this.dataChannel?.label}`);
    };

    channel.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.eventType === RTCEventType.CHAT) {
        this.storePlayerChatMessage(data.message);
      }
      this.notify("chat", this.playerChat.messages);
    };

    this.dataChannel = channel;
  }

  notify<T extends keyof RTCSubscribers>(eventType: T, data: SubscribeCallbackDataType<CallbackForSubscribeMethod<T>>) {
    this.subscribers[eventType].forEach((callback) => callback(data as any));
  }

  subscribe<T extends keyof RTCSubscribers>(event: T, callback: CallbackForSubscribeMethod<T>) {
    this.subscribers[event].set(callback as any, callback as any);
  }

  unsubscribe<T extends keyof RTCSubscribers>(event: T, callback: CallbackForSubscribeMethod<T>) {
    this.subscribers[event].delete(callback as any);
  }

  storePlayerChatMessage(message: string) {
    this.playerChat.addMessage({
      id: uuid(),
      message: message,
      timestamp: Date.now(),
    });
  }

  sendMessage(rtcEventType: RTCEventType, message: unknown) {
    console.log(message);
    const data = { eventType: rtcEventType, message };
    if (rtcEventType === RTCEventType.CHAT) {
      this.storePlayerChatMessage(message as string);
      console.log(this.playerChat.messages);
    }
    this.dataChannel?.send(JSON.stringify(data));
    this.notify("chat", this.playerChat.messages);
    console.log(this.connection.iceConnectionState);
  }

  async createOffer() {
    try {
      const dataChannel = this.connection.createDataChannel("TestDataChannel");
      this.applyDataChannelSubscription(dataChannel);

      const offer = await this.connection.createOffer();
      await this.connection.setLocalDescription(offer);
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

  // Getter method to access the WebRTC configuration
  getConfiguration() {
    return this.configuration;
  }

  // Setter method to modify the WebRTC configuration
  setConfiguration(newConfig: RTCConfiguration) {
    this.configuration = { ...this.configuration, ...newConfig };
  }
}

const rtcConfiguration: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
export const webRTCClient = new WebRTCClient(rtcConfiguration);
