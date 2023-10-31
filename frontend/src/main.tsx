import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SocketContextProvider } from "./context/SocketContext.tsx";
import { AppContextProvider } from "./context/AppContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppContextProvider>
    <SocketContextProvider>
      <App />
    </SocketContextProvider>
  </AppContextProvider>,
);
