import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

export type AppContextProps = {
  mode: ConnectionMode | undefined;
  setMode: Dispatch<SetStateAction<ConnectionMode>>;
  hosted: boolean;
  setHosted: Dispatch<SetStateAction<boolean>>;
};

export enum ConnectionMode {
  HOST = "HOST",
  JOIN = "JOIN",
  NOT_SELECTED = "NOT_SELECTED",
}

const AppContext = createContext<AppContextProps>({} as AppContextProps);

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ConnectionMode>(ConnectionMode.NOT_SELECTED);
  const [hosted, setHosted] = useState(false);

  return <AppContext.Provider value={{ mode, setMode, hosted, setHosted }}>{children}</AppContext.Provider>;
};
