import { ILobby } from "../../shared/types/lobby";
import { IChatMessage, IChatMessageClient } from "../../shared/types/chat";
import { v4 } from "uuid";

export class Lobby {
  private _chatMessages: IChatMessage[] = [];

  constructor(
    private readonly _id: string,
    private _name: string,
    private _hostId: string,
    private _clients: string[],
    private readonly _createdAt: number,
  ) {}

  get name() {
    return this._name;
  }

  set name(newName: string) {
    this._name = newName;
  }

  get id() {
    return this._id;
  }

  get flatData(): ILobby {
    return {
      id: this._id,
      hostId: this._hostId,
      name: this.name,
      clients: this._clients,
      createdAt: this._createdAt,
    };
  }

  get clients() {
    return this._clients;
  }

  get chatMessages() {
    return this._chatMessages;
  }

  addMessage(message: IChatMessageClient, authorId: string) {
    const chatMessage: IChatMessage = {
      ...message,
      type: "user",
      id: v4(),
      author: authorId,
      timestamp: Date.now(),
    };
    this._chatMessages.push(chatMessage);

    return chatMessage;
  }

  addClient(clientId: string) {
    this._clients.push(clientId);
  }

  removeClient(clientId: string) {
    this._clients = this._clients.filter((client) => client !== clientId);

    if (clientId === this._hostId && this._clients.length) {
      this.setHost(this._clients[0]);
    }
  }

  setHost(clientId: string) {
    this._hostId = clientId;
  }
}
