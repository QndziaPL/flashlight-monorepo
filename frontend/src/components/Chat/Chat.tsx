import { FC, useState } from "react";
import { Input } from "../../@/components/ui/input.tsx";
import { Button } from "../Button.tsx";
import { IChatMessage } from "../../../../shared/types/chat.ts";
import { clsx } from "clsx";

export const Chat: FC = () => {
  const [messages, setMessages] = useState<IChatMessage[]>(mockMessages);
  const [message, setMessage] = useState("");

  return (
    <div className="w-1/3 absolute left-0 bottom-0">
      <MessageList messages={messages} />
      <div className="flex">
        <Input id="lobbyName" type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button type="submit" disabled={message.length < 3}>
          send message
        </Button>
      </div>
    </div>
  );
};

type MessageListProps = {
  messages: IChatMessage[];
};
const MessageList: FC<MessageListProps> = ({ messages }) => {
  const [expanded, setExpanded] = useState(false);

  const triggerExpand = () => setExpanded((prev) => !prev);
  return (
    <div>
      <Button className="w-full text-xs py-0.5 h-auto" variant="ghost" onClick={triggerExpand}>
        {expanded ? "collapse" : "expand"}
      </Button>
      <div className={clsx("overflow-auto transition-height duration-200", expanded ? "h-80" : "h-20")}>
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
      </div>
    </div>
  );
};

const mockMessages: IChatMessage[] = [
  {
    id: "123",
    message: "Uwaga! kurwa się sprzedała i popruła pod celą, auu",
    author: "Maria Magdalena",
    type: "info",
    timestamp: 1234567,
  },
  {
    id: "234",
    message: "pizda chuj na ryj kurwie osrany śmieć",
    author: "Maria Magdalena",
    type: "user",
    timestamp: 1234567,
  },
  {
    id: "345",
    message: "pizda chuj na ryj kurwie osrany śmieć",
    author: "Maria Magdalena",
    type: "user",
    timestamp: 1234567,
  },
  {
    id: "456",
    message: "Uwaga! kurwa się sprzedała i popruła pod celą, auu",
    author: "Maria Magdalena",
    type: "info",
    timestamp: 1234567,
  },
  {
    id: "567",
    message: "Uwaga! kurwa się sprzedała i popruła pod celą, auu",
    author: "Maria Magdalena",
    type: "info",
    timestamp: 1234567,
  },
  {
    id: "321",
    message: "pizda chuj na ryj kurwie osrany śmieć",
    author: "Maria Magdalena",
    type: "user",
    timestamp: 1234567,
  },
  {
    id: "432",
    message: "pizda chuj na ryj kurwie osrany śmieć",
    author: "Maria Magdalena",
    type: "user",
    timestamp: 1234567,
  },
  {
    id: "543",
    message: "Uwaga! kurwa się sprzedała i popruła pod celą, auu",
    author: "Maria Magdalena",
    type: "info",
    timestamp: 1234567,
  },
  {
    id: "654",
    message: "pizda chuj na ryj kurwie osrany śmieć",
    author: "Maria Magdalena",
    type: "user",
    timestamp: 1234567,
  },
  {
    id: "765",
    message: "Uwaga! kurwa się sprzedała i popruła pod celą, auu",
    author: "Maria Magdalena",
    type: "info",
    timestamp: 1234567,
  },
];
