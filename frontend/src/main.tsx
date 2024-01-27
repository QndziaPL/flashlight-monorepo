import ReactDOM from "react-dom/client";
import "./index.scss";
import "./_variables.scss";
import { AppContextProvider } from "./context/AppContext.tsx";
import { WebSocketProvider } from "./context/WebSocketContext.tsx";

import { RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { ToastContextProvider } from "./context/ToastContext.tsx";
import { router } from "./Router/router.tsx";
import { LobbyContextProvider } from "./context/LobbyContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <AppContextProvider>
      <WebSocketProvider>
        <LobbyContextProvider>
          <ToastContextProvider>
            <RouterProvider router={router} />
          </ToastContextProvider>
        </LobbyContextProvider>
      </WebSocketProvider>
    </AppContextProvider>
  </AuthContextProvider>,
);
