import { FC, useState } from "react";
import { useIpAddress } from "../../hooks/useIpAddress.ts";
import { ConnectionMode, useAppContext } from "../../context/AppContext.tsx";
import { FECreateLobbyProps } from "../../../../shared/types/lobby.ts";
import { useApi } from "../../hooks/useApi.ts";
import { useSocket } from "../../hooks/useSocket.tsx";

export type HostScreenProps = {};
export const HostScreen: FC<HostScreenProps> = () => {
  const { ip, error, loading } = useIpAddress();
  const { setMode, clientId } = useAppContext();
  const socket = useSocket();

  const [lobbyName, setLobbyName] = useState<string>("");

  const createLobbyAPI = useApi<{ lobbyId: string }>();

  const handleCreateLobby = async () => {
    const createLobbyData: FECreateLobbyProps = {
      name: lobbyName,
      hostId: clientId,
    };

    // const data = await createLobbyAPI.call("/lobbys", { method: "POST", body: JSON.stringify(createLobbyData) });
    socket.emit({ eventName: "CREATE_LOBBY", data: createLobbyData });
    setMode(ConnectionMode.JOIN);
    // if (data.lobbyId) {
    //   socket.joinRoom(data.lobbyId);
    //   setMode(ConnectionMode.JOIN);
    // }
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
