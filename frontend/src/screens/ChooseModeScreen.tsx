import { FC } from "react";
import { ConnectionMode, useAppContext } from "../context/AppContext.tsx";

export type ChooseModeScreenProps = {};
export const ChooseModeScreen: FC<ChooseModeScreenProps> = () => {
  const { setMode } = useAppContext();

  return (
    <div>
      <h1>elo kurwa</h1>
      <button onClick={() => setMode(ConnectionMode.HOST)}>HOST</button>
      <button onClick={() => setMode(ConnectionMode.JOIN)}>JOIN</button>
    </div>
  );
};
