import express, {type Express, type Request, type Response} from "express";
import Path from "../os/path/Path.ts";
import Url from "./Url.ts";

export default class Server {
    private static _express: Express = express();
    private static _server: any | null = null;

    public static isConnected(): boolean {
        return !!Server._server;
    }

    public static express(): Express {
        return this._express;
    }

    public static setRootDirectory(pathish: string | Path): typeof Server {
        this
            .express()
            .use(express.static(Path.toString(pathish)));
        return Server;
    }

    public static expose(urlish: string | Url, listener: (request: Request, response: Response) => void): typeof Server {
        this
            .express()
            .get(Url.toString(urlish), listener);
        return Server;
    }

    public static exposePath(urlish: string | Url, pathish: string | Path): typeof Server {
        this.expose(Url.toString(urlish), (request, response) => {
            response.sendFile(Path.toString(pathish));
            return;
        });
        return Server;
    }

    public static exposeItem(urlish: string | Url, item: object | object[]): typeof Server {
        this.expose(Url.toString(urlish), (request, response) => {
            response.send(item);
            return;
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

    public static shutdown(): typeof Server {
        return Server._shutdown();
    }

    protected static _boot(port?: bigint): typeof Server {
        this._server = this
            .express()
            .listen(Number(port ?? 3000n));
        return Server;
    }

    protected static _shutdown(): typeof Server {
        this._server.close();
        return Server;
    }
}