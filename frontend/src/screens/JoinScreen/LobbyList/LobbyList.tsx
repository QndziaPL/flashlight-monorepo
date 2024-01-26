import { FC } from "react";
import styles from "./LobbyList.module.scss";
import { ILobby } from "../../../../../shared/types/lobby.ts";

import { formatTimestamp } from "./helpers.ts";
import { useSocket, useSocketSubscription } from "../../../context/WebSocketContext.tsx";
import { useApi } from "../../../hooks/useApi.ts";
import { ProtectedPaths } from "../../../Router/RouterPaths.ts";
import { useNavigate } from "react-router";
import { withBackslash } from "../../../Router/helpers.ts";
import { Button } from "../../../components/Button.tsx";

export const LobbyList: FC = () => {
  const navigate = useNavigate();
  const socket = useSocket();

  const [lobbys] = useSocketSubscription<"LOBBY_LIST", "GET_LOBBY_LIST">({
    eventName: "LOBBY_LIST",
    autoFireEvent: { eventName: "GET_LOBBY_LIST", data: undefined },
  });

  const lobbysApi = useApi();

  const handleJoinLobby = async (lobbyId: ILobby["id"]) => {
    lobbysApi.call("/lobbys/join", { method: "POST", body: JSON.stringify({ lobbyId }) });
    socket.client?.joinLobby(lobbyId);
  };

  return (
    <>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>active lobbys</h1>
      <Button className="mb-2" onClick={() => navigate(withBackslash(ProtectedPaths.HOST))}>
        Create lobby
      </Button>
      <div className={styles.lobbyList}>
        <div className={styles.listHeader}>
          <div>ID</div>
          <div>NAME</div>
          <div>CREATED AT</div>
          <div>HOST</div>
          <div>PLAYERS</div>
          <div>actions</div>
        </div>
        {lobbys?.length ? <LobbyListContent lobbys={lobbys} handleJoinLobby={handleJoinLobby} /> : <NoLobbysContent />}
      </div>
    </>
  );
};

const NoLobbysContent = () => <div className="text-center">No lobbys! Let's create a new one!</div>;

type LobbyListContentProps = {
  lobbys: ILobby[];
  handleJoinLobby: (lobbyId: string) => void;
};
const LobbyListContent: FC<LobbyListContentProps> = ({ lobbys, handleJoinLobby }) =>
  lobbys.map((lobby) => (
    <div key={lobby.id} className={styles.singleLobby}>
      <div>{lobby.id}</div>
      <div>{lobby.name}</div>
      <div>{formatTimestamp(lobby.createdAt)}</div>
      <div>{lobby.hostId}</div>
      <div>
        <ol>
          {Object.values(lobby.clients).map((clientId) => (
            <li key={clientId}>{clientId}</li>
          ))}
        </ol>
      </div>
      <div>
        <Button onClick={() => handleJoinLobby(lobby.id)}>JOIN</Button>
        {/*<button onClick={() => deleteLobby(lobby.id)}>DELETE</button>*/}
      </div>
    </div>
  ));
