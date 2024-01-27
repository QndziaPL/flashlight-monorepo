import { FC, FormEvent, useState } from "react";
import { useIpAddress } from "../../hooks/useIpAddress.ts";
import { FECreateLobbyProps } from "../../../../shared/types/lobby.ts";
import { useSocket } from "../../context/WebSocketContext.tsx";
import { useNavigate } from "react-router";
import { ProtectedPaths } from "../../Router/RouterPaths.ts";
import { withBackslash } from "../../Router/helpers.ts";
import { Button } from "../../components/Button.tsx";
import { Input } from "../../@/components/ui/input.tsx";
import { Label } from "../../@/components/ui/label.tsx";
import { useLobby } from "../../context/LobbyContext.tsx";
import { useToasts } from "../../context/ToastContext.tsx";
import { v4 } from "uuid";

export type HostScreenProps = {};
export const HostScreen: FC<HostScreenProps> = () => {
  const { ip, error, loading } = useIpAddress();

  const socket = useSocket();
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const { setLobbyId } = useLobby();

  const [lobbyName, setLobbyName] = useState<string>("");

  const handleCreateLobby = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const createLobbyData: FECreateLobbyProps = {
      name: lobbyName,
    };
    try {
      const lobbyId = await socket.client?.createLobby(createLobbyData);
      if (lobbyId) {
        setLobbyId(lobbyId);
        navigate(withBackslash(ProtectedPaths.LOBBY));
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error during creation of lobby";
      addToast({
        id: v4(),
        type: "error",
        message: errorMessage,
      });
    }
  };

  return (
    <div>
      <h1>host game</h1>
      {loading && <p>loading your ip...</p>}
      {error && <p>error during loading your ip</p>}
      {ip && (
        <p>
          your ip: <strong>{ip}</strong>
        </p>
      )}
      <hr />
      <form onSubmit={handleCreateLobby}>
        <Label htmlFor="lobbyName">Lobby name</Label>

        <div className="flex">
          <Input id="lobbyName" type="text" value={lobbyName} onChange={(e) => setLobbyName(e.target.value)} />
          <Button type="submit" disabled={lobbyName.length < 3}>
            create lobby
          </Button>
        </div>
      </form>
    </div>
  );
};
