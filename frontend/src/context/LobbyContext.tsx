import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { useSocketSubscription } from "./WebSocketContext.tsx";

type LobbyContextState = {
  lobbyId: string | undefined;
  setLobbyId: Dispatch<SetStateAction<string | undefined>>;
};
const LobbyContext = createContext({} as LobbyContextState);

type LobbyContextProviderProps = {
  children: ReactNode;
};
export const LobbyContextProvider: FC<LobbyContextProviderProps> = ({ children }) => {
  const [deletedLobby] = useSocketSubscription<"LOBBY_DELETED">({ eventName: "LOBBY_DELETED" });
  const [lobbyId, setLobbyId] = useState<string | undefined>();

  useEffect(() => {
    if (deletedLobby?.lobbyId && deletedLobby.lobbyId === lobbyId) {
      setLobbyId(undefined);
    }
  }, [deletedLobby]);

  return <LobbyContext.Provider value={{ lobbyId, setLobbyId }}>{children}</LobbyContext.Provider>;
};

export const useLobby = () => useContext(LobbyContext);
