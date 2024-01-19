import { FC, useEffect, useState } from "react";
import { ConnectionMode, useAppContext } from "../../context/AppContext.tsx";
import { LobbyList } from "./LobbyList/LobbyList.tsx";
import { ILobby } from "../../../../shared/types/lobby.ts";
import { useApi } from "../../hooks/useApi.ts";

export type JoinScreenProps = {};
export const JoinScreen: FC<JoinScreenProps> = () => {
  const { setMode } = useAppContext();
  const [address, setAddress] = useState("");

  const ipAddressPattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;

  const validAddress = ipAddressPattern.test(address);

  useEffect(() => {
    getLobbysAPI.call("/lobbys");
  }, []);

  const getLobbysAPI = useApi<ILobby[]>([]);
  const deleteLobbyAPI = useApi();

  const fetchLobbys = async () => {
    await getLobbysAPI.call("/lobbys");
  };

  const handleDeleteLobby = async (lobbyId: ILobby["id"]) => {
    await deleteLobbyAPI.call("/lobbys", { method: "DELETE", body: JSON.stringify({ lobbyId }) });
    fetchLobbys();
  };

  return (
    <div style={{ padding: 20 }}>
      {getLobbysAPI.loading && <p>loading lobbys...</p>}
      <h1>join game</h1>

      <LobbyList />
      {/*<LobbyList lobbys={getLobbysAPI.data ?? []} deleteLobby={handleDeleteLobby} refreshLobby={fetchLobbys} />*/}
      <hr />
      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
      <button disabled={!validAddress}>join</button>
      {!validAddress && <p style={{ color: "red" }}>ip address is invalid</p>}

      <hr />
      <button onClick={() => setMode(ConnectionMode.NOT_SELECTED)}>back to main menu</button>
    </div>
  );
};
