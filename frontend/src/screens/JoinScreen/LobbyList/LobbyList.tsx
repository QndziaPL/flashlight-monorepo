import { FC } from "react";
import styles from "./LobbyList.module.scss";
import { ILobby } from "../../../../../shared/types/lobby.ts";

import { formatTimestamp } from "./helpers.ts";
import { ConnectionMode, useAppContext } from "../../../context/AppContext.tsx";
import { ConnectionStateIndicator } from "../../../components/ConnectionStateIndicator/ConnectionStateIndicator.tsx";
import { useSocket, useSocketSubscription } from "../../../hooks/useSocket.tsx";

export const LobbyList: FC = () => {
  const { setMode } = useAppContext();
  const socket = useSocket();
  const [lobbys] = useSocketSubscription<"LOBBY_LIST", "GET_LOBBY_LIST">({
    eventName: "LOBBY_LIST",
    autoFireEvent: { eventName: "GET_LOBBY_LIST", data: undefined },
  });

  console.log(lobbys);
  const handleJoinLobby = async (lobbyId: ILobby["id"]) => {
    socket.joinRoom(lobbyId);
  };

  // const handleSubmitTextMessage = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   webRTCClient.sendMessage(RTCEventType.CHAT, testInputValue);
  // };

  return (
    <>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>active lobbys</h1>
      <button onClick={() => setMode(ConnectionMode.HOST)}>host screen</button>
      <div className={styles.lobbyList}>
        <ConnectionStateIndicator state={WebSocket.CLOSED} />
        <div className={styles.listHeader}>
          <div>ID</div>
          <div>NAME</div>
          <div>CREATED AT</div>
          <div>HOST</div>
          <div>PLAYERS</div>
          <div>actions</div>
        </div>
        {lobbys?.map((lobby) => (
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
              {/*<button onClick={() => handleJoinLobby(lobby.id)}>JOIN</button>*/}
              {/*<button onClick={() => deleteLobby(lobby.id)}>DELETE</button>*/}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
