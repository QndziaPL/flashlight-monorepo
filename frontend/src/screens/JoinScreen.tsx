import { FC, useState } from "react";
import { ConnectionMode, useAppContext } from "../context/AppContext.tsx";

export type JoinScreenProps = {};
export const JoinScreen: FC<JoinScreenProps> = () => {
  const { mode, setMode } = useAppContext();
  const [address, setAddress] = useState("");

  const ipAddressPattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;

  const validAddress = ipAddressPattern.test(address);

  return (
    <div style={{ padding: 20 }}>
      <h1>join game</h1>
      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
      <button disabled={!validAddress}>join</button>
      {!validAddress && <p style={{ color: "red" }}>ip address is invalid</p>}

      <hr />
      <button onClick={() => setMode(ConnectionMode.NOT_SELECTED)}>back to main menu</button>
    </div>
  );
};
