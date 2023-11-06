import { FC } from "react";
import styles from "./LobbyList.module.scss";
import { Lobby } from "../../../../../shared/types/lobby.ts";
import RTC from "../../../RTC/RTC.ts";
import { useSocket } from "../../../context/SocketContext.tsx";

export type LobbyListProps = {
  lobbys: Lobby[];
  deleteLobby: (lobbyId: Lobby["id"]) => Promise<void>;
};
export const LobbyList: FC<LobbyListProps> = ({ lobbys, deleteLobby }) => {
  const { joinRoom } = useSocket();
  const handleJoinLobby = async (lobbyId: Lobby["id"], offer?: RTCSessionDescriptionInit) => {
    await RTC.createAnswer(offer);
    joinRoom(lobbyId);
  };

  return (
    <>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>active lobbys</h1>
      <div className={styles.lobbyList}>
        <div className={styles.listHeader}>
          <div>ID</div>
          <div>NAME</div>
          <div>HOST</div>
          <div>PLAYERS</div>
          <div>actions</div>
        </div>
        {lobbys.map((lobby) => (
          <div key={lobby.id} className={styles.singleLobby}>
            <div>{lobby.id}</div>
            <div>{lobby.name}</div>
            <div>{lobby.hostId}</div>
            <div>
              <ol>
                {Object.values(lobby.clients).map((clientId) => (
                  <li key={clientId}>{clientId}</li>
                ))}
              </ol>
            </div>
            <div>
              <button onClick={() => handleJoinLobby(lobby.id, lobby.webrtc.offer)}>JOIN</button>
              <button onClick={() => deleteLobby(lobby.id)}>DELETE</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
