export type ILobby = {
  id: string;
  name: string;
  hostId: string;
  clients: string[];
  createdAt: number;
};

export type CreateLobbyProps = Omit<ILobby, "id">;
export type FECreateLobbyProps = Omit<CreateLobbyProps, "clients" | "createdAt" | "hostId">;
