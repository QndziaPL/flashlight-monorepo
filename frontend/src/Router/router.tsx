import { createBrowserRouter } from "react-router-dom";
import { PublicLayout } from "./RouterLayouts/PublicLayout.tsx";
import { ProtectedPaths, PublicPaths } from "./RouterPaths.ts";
import { Home } from "../screens/Home.tsx";
import { LoginScreen } from "../screens/LoginScreen/LoginScreen.tsx";
import { RegisterScreen } from "../screens/RegisterScreen/RegisterScreen.tsx";
import { ProtectedLayout } from "./RouterLayouts/ProtectedLayout.tsx";
import { LobbysScreen } from "../screens/JoinScreen/LobbysScreen.tsx";
import { HostScreen } from "../screens/HostScreen/HostScreen.tsx";
import { Navigate } from "react-router";
import { SingleLobbyScreen } from "../screens/SingleLobbyScreen/SingleLobbyScreen.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        path: PublicPaths.HOME,
        element: <Home />,
      },
      {
        path: PublicPaths.LOGIN,
        element: <LoginScreen />,
      },
      {
        path: PublicPaths.REGISTER,
        element: <RegisterScreen />,
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        path: ProtectedPaths.LOBBY_LIST,
        element: <LobbysScreen />,
      },
      {
        path: ProtectedPaths.HOST,
        element: <HostScreen />,
      },
      {
        path: ProtectedPaths.LOBBY,
        element: <SingleLobbyScreen />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to={PublicPaths.HOME} replace />,
  },
]);
