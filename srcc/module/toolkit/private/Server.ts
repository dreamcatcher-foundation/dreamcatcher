import type {Express} from "express";
import type {Request} from "express";
import type {Response} from "express";
import type {PathLike} from "./Lib__Path.ts";
import {Path} from "./Lib__Path.ts";
import {Url} from "./Url.ts";
import express from "express";

type ServerListener = (request: Request, response: Response) => void;

type Item = object | object[];

class Server {
    private static _express: Express = express();
    private static _server: any | null = null;

    public static isConnected(): boolean {
        return !!Server._server;
    }

    public static express(): Express {
        return this._express;
    }

    public static setRootDir(pathLike: PathLike): typeof Server {
        this.express().use(express.static(Path.toString(pathLike)));
        return Server;
    }

    public static expose(urlLike: string | Url, serverListener: ServerListener): void {
        this.express().get(Url.toString(urlLike), serverListener);
        return;
    }

    public static exposePath(urlLike: string | Url, pathLike: string | Path): typeof Server {
        this.expose(Url.toString(urlLike), function(request, response) {
            response.sendFile(Path.toString(pathLike));
        });
        return Server;
    }

    public static exposeItem(urlLike: string | Url, item: object | object[]): typeof Server {
        this.expose(Url.toString(urlLike), function(request, response) {
            response.send(item);
        });
        return Server;
    }

    public static boot(port?: bigint): typeof Server {
        if (!Server.isConnected()) {
            Server._boot(port);
            return Server;
        }
        Server
            ._shutdown()
            ._boot(port);
        return Server;
    }

    protected static _boot(port?: bigint): typeof Server {
        const portAsNum: number = Number(port ?? 3000n);
        this._server = this.express().listen(portAsNum);
        return Server;
    }

    protected static _shutdown(): typeof Server {
        this._server.close();
        return Server;
    }
}

export type {ServerListener};
export type {Item};
export {Server};