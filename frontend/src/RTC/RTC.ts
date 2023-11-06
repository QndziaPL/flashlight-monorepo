class WebRTCClient {
  configuration: RTCConfiguration;
  connection: RTCPeerConnection;

  constructor(config: RTCConfiguration) {
    this.configuration = config;
    this.connection = new RTCPeerConnection(this.configuration);
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
    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);

    return this.connection.localDescription ?? undefined;
  }

  async createAnswer(offer?: RTCSessionDescriptionInit) {
    if (!offer) throw new Error("No offer");
    await this.connection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.connection.createAnswer();

    return answer;
  }

  public get signalingState(): RTCSignalingState {
    return this.connection.signalingState;
  }
}

const rtcConfiguration: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
const webRTCClient = new WebRTCClient(rtcConfiguration);

export default webRTCClient;
