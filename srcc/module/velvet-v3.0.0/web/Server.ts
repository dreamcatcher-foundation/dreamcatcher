import type {Express} from "express";
import express from "express";
import type {Request} from "express";
import type {Response} from "express";
import Path from "../os/path/Path.ts";
import Url from "./url/Url.ts";

export type ServerHook = (request: Request, response: Response) => any;

export default class Server {
    private static _express: Express = express();
    private static _server: any | null = null;

    public static express(): Express {
        return this._express;
    }

    public static setRootDir(path: Path): typeof Server {
        this._express.use(express.static(path.value()));
        return Server;
    }

    public static expose(url: Url, hook: ServerHook): typeof Server {
        this.express().get(url.get(), hook);
        return Server;
    }

    public static exposePath(url: Url, path: Path): typeof Server {
        return this.expose(url, function(request, response) {
            response.sendFile(path.value());
            return;
        });
    }

    public static exposeItem(url: Url, item: object | object[]): typeof Server {
        return this.expose(url, function(request, response) {
            response.send(item);
            return;
        });
    }

    public static boot(port?: bigint): typeof Server {
        if (!this._server) {
            this._boot(port);
            return Server;
        }
        this._shutdown();
        this._boot(port);
        return Server;
    }

    private static _boot(port?: bigint): typeof Server {
        const portAsNum: number = Number(port ?? 3000n);
        this._server = this.express().listen(portAsNum);
        return Server;
    }

    private static _shutdown(): typeof Server {
        this._server.close();
        return Server;
    }
}