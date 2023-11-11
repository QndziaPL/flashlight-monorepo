export class PlayerChat {
  private _messages: PlayerChatMessage[] = [];

  get messages(): PlayerChatMessage[] {
    return [...this._messages];
  }

  addMessage(message: PlayerChatMessage) {
    this._messages.push(message);
  }
}

export type PlayerChatMessage = {
  id: string;
  timestamp: number;
  message: string;
};
