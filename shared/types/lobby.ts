export type Lobby = {
    id: string;
    name: string;
    hostId: string;
    clients: string[];
    createdAt: number;
    webrtc: WebRTC;
};

export type WebRTC = {
    offer?: RTCSessionDescriptionInit;
    answer?: RTCSessionDescriptionInit;
    iceCandidates?: RTCIceCandidateInit;
};

export type CreateLobbyProps = Omit<Lobby, "id">;
export type FECreateLobbyProps = Omit<CreateLobbyProps, "clients" | "createdAt">
