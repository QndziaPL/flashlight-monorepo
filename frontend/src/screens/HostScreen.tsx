import { FC, useState } from "react";
import { useIpAddress } from "../hooks/useIpAddress.ts";
import { ConnectionMode, useAppContext } from "../context/AppContext.tsx";

export type HostScreenProps = {};
export const HostScreen: FC<HostScreenProps> = () => {
  const { ip, error, loading } = useIpAddress();
  const { setMode, clientId } = useAppContext();
  const [lobbyName, setLobbyName] = useState<string>("");

  const handleCreateLobby = () => {
    fetch("http://localhost/api/lobbys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: lobbyName, clientId }),
    });
  };

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

      <input type="text" value={lobbyName} onChange={(e) => setLobbyName(e.target.value)} />
      <button onClick={handleCreateLobby} disabled={lobbyName.length < 3}>
        create lobby
      </button>
      <button onClick={() => setMode(ConnectionMode.NOT_SELECTED)}>back to main menu</button>
    </div>
  );
};
