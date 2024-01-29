import { FC, FormEvent, RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Input } from "../../@/components/ui/input.tsx";
import { Button } from "../Button.tsx";
import { IChatMessage } from "../../../../shared/types/chat.ts";
import { clsx } from "clsx";
import { useSocket, useSocketSubscription } from "../../context/WebSocketContext.tsx";
import { useLobby } from "../../context/LobbyContext.tsx";

export const Chat: FC = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [socketMessage] = useSocketSubscription<"CHAT_MESSAGE">({ eventName: "CHAT_MESSAGE" });
  const { client } = useSocket();
  const { lobbyId } = useLobby();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (socketMessage) {
      setMessages((prev) => [...prev, socketMessage]);
    }
  }, [socketMessage]);

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const handleSendMessage = (event: FormEvent) => {
    event.preventDefault();
    client?.sendChatMessage(message, lobbyId);
  };

  return (
    <div className="w-1/3 absolute left-0 bottom-0">
      <MessageList messages={messages} messagesEndRef={messagesEndRef} />
      <form className="flex" onSubmit={handleSendMessage}>
        <Input id="lobbyName" type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button type="submit" disabled={message.length < 3}>
          send message
        </Button>
      </form>
    </div>
  );
};

type MessageListProps = {
  messages: IChatMessage[];
  messagesEndRef: RefObject<HTMLDivElement>;
};
const MessageList: FC<MessageListProps> = ({ messages, messagesEndRef }) => {
  const [expanded, setExpanded] = useState(false);

  const triggerExpand = () => setExpanded((prev) => !prev);
  return (
    <div>
      <Button className="w-full text-xs py-0.5 h-auto" variant="ghost" onClick={triggerExpand}>
        {expanded ? "collapse" : "expand"}
      </Button>
      <div
        className={clsx("transition-height duration-200 overflow-y-auto overflow-x-hidden", expanded ? "h-80" : "h-20")}
      >
        {messages.map(({ id, message, type, timestamp, author }) => {
          const userMessage = type === "user";

          return (
            <div key={id}>
              <span>
                [<span className="mr-1 text-xs">{timestamp}</span>
                <span className={clsx(userMessage ? "text-green-600" : "text-red-700")}>
                  {userMessage ? author : "INFO"}
                </span>
                ]
              </span>
              <span className={clsx("ml-2", userMessage ? "text-black" : "text-red-700")}>{message}</span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
