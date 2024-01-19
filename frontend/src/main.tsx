import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AppContextProvider } from "./context/AppContext.tsx";
import { WebSocketProvider } from "./hooks/useSocket.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppContextProvider>
    <WebSocketProvider>
      <App />
    </WebSocketProvider>
  </AppContextProvider>,
);
