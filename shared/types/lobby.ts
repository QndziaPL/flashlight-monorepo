export type LobbyDTO = {
  id: string;
  name: string;
  hostId: string;
  clients: string[];
  createdAt: number;
};

export type CreateLobbyProps = Omit<LobbyDTO, "id">;
export type FECreateLobbyProps = Omit<CreateLobbyProps, "clients" | "createdAt" | "hostId">;
