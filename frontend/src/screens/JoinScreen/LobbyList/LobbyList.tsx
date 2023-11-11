import { FC, useCallback, useEffect, useState } from "react";
import styles from "./LobbyList.module.scss";
import { Lobby } from "../../../../../shared/types/lobby.ts";

import { webRTCClient } from "../../../RTC/RTC.ts";
import { formatTimestamp } from "./helpers.ts";
import { RTCEventType } from "../../../../../shared/types/rtc.ts";
import { socket } from "../../../socket/Socket.ts";
import { ConnectionMode, useAppContext } from "../../../context/AppContext.tsx";
import { PlayerChatMessage } from "../../../RTC/PlayerChat.ts";

export type LobbyListProps = {
  lobbys: Lobby[];
  deleteLobby: (lobbyId: Lobby["id"]) => Promise<void>;
  refreshLobby: () => Promise<void>;
};
export const LobbyList: FC<LobbyListProps> = ({ lobbys, deleteLobby, refreshLobby }) => {
  const { setMode } = useAppContext();
  const handleJoinLobby = async (lobbyId: Lobby["id"], offer?: RTCSessionDescriptionInit) => {
    const answer = await webRTCClient.createAnswer(offer);
    socket.joinRoom(lobbyId, answer);
  };

  const [chatMessages, setChatMessages] = useState<PlayerChatMessage[]>([]);

  const [testInputValue, setTestInputValue] = useState("");

  const handleOnRTCChatMessage = useCallback((chatMessages: PlayerChatMessage[]) => setChatMessages(chatMessages), []);

  useEffect(() => {
    webRTCClient.subscribeForChatMessages(handleOnRTCChatMessage);
  }, []);

  return (
    <>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        active lobbys <button onClick={refreshLobby}>refresh</button>
      </h1>
      <button onClick={() => setMode(ConnectionMode.HOST)}>host screen</button>
      <div className={styles.lobbyList}>
        <div className={styles.listHeader}>
          <div>ID</div>
          <div>NAME</div>
          <div>CREATED AT</div>
          <div>HOST</div>
          <div>PLAYERS</div>
          <div>actions</div>
        </div>
        {lobbys.map((lobby) => (
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
              <button onClick={() => handleJoinLobby(lobby.id, lobby.webrtc.offer)}>JOIN</button>
              <button onClick={() => deleteLobby(lobby.id)}>DELETE</button>
            </div>
          </div>
        ))}
        <div style={{ margin: 20 }}>
          <input type="text" value={testInputValue} onChange={(e) => setTestInputValue(e.target.value)} />
          <button onClick={() => webRTCClient.sendMessage(RTCEventType.CHAT, testInputValue)}>
            SEND MESSAGE VIA WEBRTC
          </button>
          <ul>
            {chatMessages.map((message) => (
              <li key={message.id}>{message.message}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
