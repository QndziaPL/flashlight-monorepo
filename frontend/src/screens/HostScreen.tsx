import { FC } from "react";
import { useIpAddress } from "../hooks/useIpAddress.ts";
import { ConnectionMode, useAppContext } from "../context/AppContext.tsx";

export type HostScreenProps = {};
export const HostScreen: FC<HostScreenProps> = () => {
  const { ip, error, loading } = useIpAddress();
  const { setMode } = useAppContext();

  return (
    <div>
      <h1>host game</h1>
      {loading && <p>loading your ip...</p>}
      {error && <p>error during loading your ip</p>}
      {ip && (
        <p>
          your ip: <strong>{ip}</strong>
        </p>
      )}
      <hr />
      <button onClick={() => setMode(ConnectionMode.NOT_SELECTED)}>back to main menu</button>
    </div>
  );
};
