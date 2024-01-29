import express, { Application, Request, Response } from "express";
import http from "http";
import cors from "cors";
import { injectable } from "inversify";

const PORT = process.env.PORT ?? 80;

@injectable()
export class ServerService {
  private readonly _app: Application;
  private readonly _server: http.Server;

  constructor() {
    this._app = express();
    this.applyMiddlewares();

    this._server = http.createServer(this._app);
    this.listenOnPort();

    this._app.get("/", (req: Request, res: Response) => {
      res.send("SIEMANEIRO!");
    });
  }

  private listenOnPort() {
    this._server.listen(PORT, () => {
      console.log(`Serwer nakurwia na porcie ${PORT}`);
    });
  }

  private applyMiddlewares() {
    this._app.use(express.json());
    this._app.use(cors({ origin: "*" }));
  }

  get server() {
    return this._server;
  }

  get app() {
    return this._app;
  }
}
