import express, {type Express, type Request, type Response} from "express";
import {Path} from "../os/path/Path.ts";
import Url from "./Url.ts";

type ServerListener = (request: Request, response: Response) => void;

type UrlStringOrUrl = string | Url;

type PathStringOrPath = string | Path;

export default class Server {
    protected static _express: Express = express();
    protected static _server: any | null = null;

    public static isConnected(): boolean {
        return !!this._server;
    }

    public static express(): Express {
        return this._express;
    }

    public static setRootDir(path: Path): void {
        this._express.use(express.static(path.get()));
    }

    public static expose(url: string | Url, serverListener: ServerListener): void {
        this.express().get(Url.toString(url), serverListener);
    }

    public static exposePath(url: UrlStringOrUrl, path: string | Path): void {
        this.expose(url, (request, response) => response.sendFile(path.get()));
    }

    public static boot(port?: bigint): void {
        if (!this.isConnected()) {
            return this._boot(port);
        }
        this._shutdown();
        this._boot(port);
    }

    protected static _boot(port?: bigint): void {
        this._server = this.express().listen(Number(port));
    }

    protected static _shutdown(): void {
        this._server.close();
    }
}
