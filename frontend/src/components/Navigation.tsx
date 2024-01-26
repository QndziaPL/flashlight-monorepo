import "./Navigation/Navigation.scss";
import { Link } from "react-router-dom";
import { withBackslash } from "../Router/helpers.ts";
import { ProtectedPaths, PublicPaths } from "../Router/RouterPaths.ts";
import { useAuth } from "../context/AuthContext.tsx";
import kupa from "/kupa.png";
import { FC } from "react";

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
      <Link to={withBackslash(PublicPaths.HOME)}>Home</Link>
    </li>
    <li>
      <Link to={withBackslash(ProtectedPaths.HOST)}>Host</Link>
    </li>
    <li>
      <Link to={withBackslash(ProtectedPaths.LOBBYS)}>Lobby List</Link>
    </li>
    <li>
      <a onClick={logout}>Log out</a>
    </li>
  </>
);

const NotLoggedActionBar = () => (
  <>
    <li>
      <Link to={withBackslash(PublicPaths.HOME)}>Home</Link>
    </li>
    <li>
      <Link to={withBackslash(PublicPaths.LOGIN)}>Login</Link>
    </li>
    <li>
      <Link to={withBackslash(PublicPaths.REGISTER)}>Register</Link>
    </li>
  </>
);
