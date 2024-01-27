import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from "react";

type LobbyContextState = {
  lobbyId: string | undefined;
  setLobbyId: Dispatch<SetStateAction<string | undefined>>;
};
const LobbyContext = createContext({} as LobbyContextState);

type LobbyContextProviderProps = {
  children: ReactNode;
};
export const LobbyContextProvider: FC<LobbyContextProviderProps> = ({ children }) => {
  const [lobbyId, setLobbyId] = useState<string | undefined>();

  return <LobbyContext.Provider value={{ lobbyId, setLobbyId }}>{children}</LobbyContext.Provider>;
};

export const useLobby = () => useContext(LobbyContext);
