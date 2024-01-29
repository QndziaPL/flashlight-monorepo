import "./Navigation/Navigation.scss";
import { ProtectedPaths, PublicPaths } from "../Router/RouterPaths.ts";
import { useAuth } from "../context/AuthContext.tsx";
import kupa from "/kupa.png";
import { FC } from "react";
import { Button } from "./Button.tsx";
import { ConnectionPingIndicator } from "./ConnectionStateIndicator/ConnectionPingIndicator.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../@/components/ui/dropdown-menu.tsx";

export const Navigation = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-secondary">
      <img src={kupa} alt="logo" />
      <ConnectionPingIndicator />
      <ul>{user ? <LoggedActionBar /> : <NotLoggedActionBar />}</ul>
    </nav>
  );
};

const LoggedActionBar: FC = () => (
  <>
    <li>
      <Button link={PublicPaths.HOME}>Home</Button>
    </li>
    <li>
      <Button link={ProtectedPaths.HOST}>Host</Button>
    </li>
    <li>
      <Button link={ProtectedPaths.LOBBY_LIST}>Lobby List</Button>
    </li>
    <li>
      <ProfileDropdown />
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

const ProfileDropdown = () => {
  const { user, logout } = useAuth();

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">{user?.email}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={logout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
