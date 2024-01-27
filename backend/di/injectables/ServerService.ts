import express, { Application } from "express";
import http from "http";
import cors from "cors";

const port = process.env.PORT ?? 80;

export class ServerService {
  private readonly _app: Application;
  private readonly _server: http.Server;

  constructor() {
    this._app = express();
    this._app.use(express.json());
    this._app.use(cors({ origin: "*" }));

    this._server = http.createServer(this._app);
    this._server.listen(port, () => {
      console.log(`Serwer nakurwia na porcie ${port}`);
    });
  }

  get server() {
    return this._server;
  }

  get app() {
    return this._app;
  }
}
