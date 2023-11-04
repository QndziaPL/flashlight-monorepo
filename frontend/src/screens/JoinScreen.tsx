import { FC, useEffect, useState } from "react";
import { ConnectionMode, useAppContext } from "../context/AppContext.tsx";
import { Lobby } from "../../../shared/types.ts";

export type JoinScreenProps = {};
export const JoinScreen: FC<JoinScreenProps> = () => {
  const { mode, setMode } = useAppContext();
  const [address, setAddress] = useState("");
  const [lobbys, setLobbys] = useState<Lobby[]>([]);

  const ipAddressPattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;

  const validAddress = ipAddressPattern.test(address);

  useEffect(() => {
    fetchLobbys();
  }, []);

  const fetchLobbys = async () => {
    const data = await fetch("http://localhost/lobbys");
    const dataJson: Lobby[] = await data.json();
    setLobbys(dataJson);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>join game</h1>
      <p>lobbys</p>
      {lobbys.map((lobby) => (
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <div>{lobby.name}</div>
          <div>{lobby.hostIp}</div>
        </div>
      ))}
      <hr />
      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
      <button disabled={!validAddress}>join</button>
      {!validAddress && <p style={{ color: "red" }}>ip address is invalid</p>}

      <hr />
      <button onClick={() => setMode(ConnectionMode.NOT_SELECTED)}>back to main menu</button>
    </div>
  );
};
