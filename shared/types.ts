export type XYNumericValues = { x: number; y: number };

export type Lobby = {
  id: string;
  name: string;
  hostId: string;
  clients: string[];
  webrtc: WebRTC;
};

export type WebRTC = {
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  iceCandidates?: RTCIceCandidateInit;
};
