import { FC, useState } from "react";
import { useIpAddress } from "../../hooks/useIpAddress.ts";
import { FECreateLobbyProps } from "../../../../shared/types/lobby.ts";
import { useSocket } from "../../context/WebSocketContext.tsx";
import { useNavigate } from "react-router";
import { ProtectedPaths } from "../../Router/RouterPaths.ts";
import { withBackslash } from "../../Router/helpers.ts";

export type HostScreenProps = {};
export const HostScreen: FC<HostScreenProps> = () => {
  const { ip, error, loading } = useIpAddress();

  const socket = useSocket();
  const navigate = useNavigate();

  const [lobbyName, setLobbyName] = useState<string>("");

  const handleCreateLobby = async () => {
    const createLobbyData: FECreateLobbyProps = {
      name: lobbyName,
    };
    console.log(socket);

    // const data = await createLobbyAPI.call("/lobbys", { method: "POST", body: JSON.stringify(createLobbyData) });
    socket?.createLobby(createLobbyData);
    navigate(withBackslash(ProtectedPaths.LOBBYS));

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
    </div>
  );
};
