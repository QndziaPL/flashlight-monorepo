export type ChatMessageType = "user" | "info";
export type IChatMessage = {
  id: string;
  message: string;
  timestamp: number;
  type: ChatMessageType;
  author: string;
};

export type IChatMessageClient = Pick<IChatMessage, "message" | "author">;
