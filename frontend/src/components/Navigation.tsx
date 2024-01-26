import "./Navigation/Navigation.scss";
import { ProtectedPaths, PublicPaths } from "../Router/RouterPaths.ts";
import { useAuth } from "../context/AuthContext.tsx";
import kupa from "/kupa.png";
import { FC } from "react";
import { Button } from "./Button.tsx";

export const Navigation = () => {
  const { user, logout } = useAuth();
  return (
    <nav>
      <img src={kupa} alt="logo" />
      <ul>{user ? <LoggedActionBar logout={logout} /> : <NotLoggedActionBar />}</ul>
    </nav>
  );
};

type LoggedActionBarProps = {
  logout: () => void;
};
const LoggedActionBar: FC<LoggedActionBarProps> = ({ logout }) => (
  <>
    <li>
      <Button link={PublicPaths.HOME}>Home</Button>
    </li>
    <li>
      <Button link={ProtectedPaths.HOST}>Host</Button>
    </li>
    <li>
      <Button link={ProtectedPaths.LOBBYS}>Lobby List</Button>
    </li>
    <li>
      <Button variant="ghost" onClick={logout}>
        Logout
      </Button>
    </li>
  </>
);

const NotLoggedActionBar = () => (
  <>
    <li>
      <Button link={PublicPaths.HOME}>Home</Button>
    </li>
    <li>
      <Button link={PublicPaths.LOGIN}>Login</Button>
    </li>
    <li>
      <Button link={PublicPaths.REGISTER}>Register</Button>
    </li>
  </>
);
