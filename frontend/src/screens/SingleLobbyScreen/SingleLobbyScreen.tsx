import { useLobby } from "../../context/LobbyContext.tsx";
import { Navigate } from "react-router";
import { ProtectedPaths } from "../../Router/RouterPaths.ts";
import { Toast } from "../../context/ToastContext.tsx";
import { v4 } from "uuid";
import { withBackslash } from "../../Router/helpers.ts";
import { Chat } from "../../components/Chat/Chat.tsx";

export const SingleLobbyScreen = () => {
  const { lobbyId, setLobbyId } = useLobby();

  if (!lobbyId) {
    const toast: Toast = {
      id: v4(),
      type: "error",
      message: "Lobby ID is missing in context. Join via lobby list screen",
    };
    return <Navigate to={withBackslash(ProtectedPaths.LOBBY_LIST)} state={{ toast }} />;
  }

  return (
    <div>
      <h1>Lobby: {lobbyId}</h1>
      <Chat />
    </div>
  );
};
