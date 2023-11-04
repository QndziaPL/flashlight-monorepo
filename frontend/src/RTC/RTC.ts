const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  // Add more WebRTC configuration options here
};

class WebRTCConfiguration {
  connection: RTCPeerConnection;

  constructor() {
    this.connection = new RTCPeerConnection(configuration);
  }

  // Getter method to access the WebRTC configuration
  getConfiguration() {
    return this.configuration;
  }

  // Setter method to modify the WebRTC configuration
  setConfiguration(newConfig) {
    this.configuration = { ...this.configuration, ...newConfig };
  }

  async createOffer() {
    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);
  }
}

const webRTCConfig = new WebRTCConfiguration();

export { webRTCConfig };
