import { FC, useState } from "react";
import { Input } from "../../@/components/ui/input.tsx";
import { Button } from "../Button.tsx";

export type ChatMessageType = "user" | "info";
export type ChatMessage = {
  id: string;
  message: string;
  timestamp: number;
  type: ChatMessageType;
};
export const Chat: FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");

  return (
    <div>
      <div className="flex">
        <Input id="lobbyName" type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button type="submit" disabled={message.length < 3}>
          create lobby
        </Button>
      </div>
    </div>
  );
};
