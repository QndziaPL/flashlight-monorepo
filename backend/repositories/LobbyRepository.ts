import { Repository } from "./Repository";
import { Lobby } from "../lobby/Lobby";
import { injectable } from "inversify";

@injectable()
export class LobbyRepository extends Repository<Lobby, Lobby["id"]> {}
