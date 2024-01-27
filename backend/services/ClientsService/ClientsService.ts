type IClient = {
  id: string;
  socketConnectionId: string;
  nick: string;
};

export class ClientsService {
  private _clients: IClient[] = [];

  get clients(): IClient[] {
    return this._clients;
  }

  addClient(client: IClient) {
    const clientIndex = this._clients.findIndex((existingClient) => existingClient.id === client.id);
    if (clientIndex === -1) {
      this._clients.push(client);
    } else {
      this._clients[clientIndex] = { ...this._clients[clientIndex], socketConnectionId: client.id };
    }
  }

  removeClient(id: IClient["id"]) {
    this._clients = this._clients.filter((client) => client.id !== id);
  }
}
