import ReactDOM from "react-dom/client";
import "./index.css";
import { AppContextProvider } from "./context/AppContext.tsx";
import { WebSocketProvider } from "./context/WebSocketContext.tsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./screens/Home.tsx";
import { LoginScreen } from "./screens/LoginScreen/LoginScreen.tsx";
import { RegisterScreen } from "./screens/RegisterScreen/RegisterScreen.tsx";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { JoinScreen } from "./screens/JoinScreen/JoinScreen.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "login",
        element: <LoginScreen />,
      },
      {
        path: "register",
        element: <RegisterScreen />,
      },
    ],
  },
  {
    path: "/lobbys",
    element: (
      <ProtectedRoute>
        <JoinScreen />
      </ProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <AppContextProvider>
      <WebSocketProvider>
        <RouterProvider router={router} />
      </WebSocketProvider>
    </AppContextProvider>
  </AuthContextProvider>,
);
