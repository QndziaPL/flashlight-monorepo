import ReactDOM from "react-dom/client";
import "./index.scss";
import "./_variables.scss";
import { AppContextProvider } from "./context/AppContext.tsx";
import { WebSocketProvider } from "./context/WebSocketContext.tsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./screens/Home.tsx";
import { LoginScreen } from "./screens/LoginScreen/LoginScreen.tsx";
import { RegisterScreen } from "./screens/RegisterScreen/RegisterScreen.tsx";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { ProtectedLayout } from "./Router/RouterLayouts/ProtectedLayout.tsx";
import { LobbysScreen } from "./screens/JoinScreen/LobbysScreen.tsx";
import { ProtectedPaths, PublicPaths } from "./Router/RouterPaths.ts";
import { PublicLayout } from "./Router/RouterLayouts/PublicLayout.tsx";
import { HostScreen } from "./screens/HostScreen/HostScreen.tsx";
import { ToastContextProvider } from "./context/ToastContext.tsx";
import { Navigate } from "react-router";

const router = createBrowserRouter([
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
    path: "",
    element: <ProtectedLayout />,
    children: [
      {
        path: ProtectedPaths.LOBBYS,
        element: <LobbysScreen />,
      },
      {
        path: ProtectedPaths.HOST,
        element: <HostScreen />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to={PublicPaths.HOME} replace />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <AppContextProvider>
      <WebSocketProvider>
        <ToastContextProvider>
          <RouterProvider router={router} />
        </ToastContextProvider>
        {/*<Navigate to="home" />*/}
      </WebSocketProvider>
    </AppContextProvider>
  </AuthContextProvider>,
);
