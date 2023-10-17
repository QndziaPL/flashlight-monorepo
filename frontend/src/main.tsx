import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SocketContextProvider } from "./context/socketContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <SocketContextProvider>
    <App />
  </SocketContextProvider>,
);
