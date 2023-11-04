import { FC } from "react";
import { Lobby } from "../../../../../shared/types.ts";
import styles from "./LobbyList.module.scss";

export type LobbyListProps = {
  lobbys: Lobby[];
};
export const LobbyList: FC<LobbyListProps> = ({ lobbys }) => (
  <>
    <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>active lobbys</h1>
    <div className={styles.lobbyList}>
      <div className={styles.listHeader}>
        <div>ID</div>
        <div>NAME</div>
        <div>PLAYERS</div>
      </div>
      {lobbys.map((lobby) => (
        <div key={lobby.id} className={styles.singleLobby}>
          <div>{lobby.id}</div>
          <div>{lobby.name}</div>
          <div>
            <ol>
              {Object.values(lobby.clients).map((clientId) => (
                <li key={clientId}>{clientId}</li>
              ))}
            </ol>
          </div>
        </div>
      ))}
    </div>
  </>
);
