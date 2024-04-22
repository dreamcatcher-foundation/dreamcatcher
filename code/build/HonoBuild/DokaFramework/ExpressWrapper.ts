import type {Express, Request, Response} from "express";
import express from "express";
import {join} from "path";

type Handler = (request: Request, response: Response) => unknown;
type Endpoint = ({
    url: string;
    handler: Handler;
});

let endpoints_: Endpoint[] = [];
let express_: Express;
let server_: unknown;
let port_: number;

export function useStatic() {}

export function usePort(port: bigint) {
    port_ = Number(port);
}

export function expose(url: string, handler: Handler) {
    return express_.get(url, handler);
}

export function exposeFile(url: string, path: string) {
    expose(url, function(request, response) {
        response.sendFile(path);
    });
}

export function exposeItem(url: string, item: object) {
    expose(url, function(request, response) {
        response.send(item);
    });
}

export function shutdown() {
    (server_ as any).close();
}

type UpdateArgs = ({
    port?: bigint;
    endpoints: Endpoint[];
});

function _update(args: UpdateArgs) {
    const {port, endpoints} = args;
    shutdown();
    express_ = express();
    server_ = express_.listen(port);
    for (let i = 0; i < endpoints.length; i++) {
        expose(endpoints[i].url, endpoints[i].handler);
    }
    return null;
}

export function restart() {}

function Server(_static: string, _port: bigint = 3000n) {
    let _express: Express;
    let _instance = ({
        open,
        sendItem,
        sendFile
    });

    (function() {
        _express = express();
        _express.use(express.static(join(__dirname, _static)));
        
    })();

    let _server = _express.listen(Number(_port));

    function open(url: string, handler: (request: Request, response: Response) => unknown) {
        _express.get(url, handler);
    }

    function sendFile(url: string, path: string) {
        open(url, function(request, response) {
            response.sendFile(path);
        })
    }

    function sendItem(url: string, object: object) {
        open(url, function(request, response) {
            response.send(object);
        });
    }

    function edit() {
        shutdown();

    }

    function shutdown() {
        _server.close();
        
    }

    return _instance;
}

const server = Server("");
server.sendFile("/", "");
server.sendItem("/", {
    name: ""
})