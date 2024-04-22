import type {Express, Request, Response} from "express";
import express from "express";
import {join} from "path";

let _express: Express;
let _server: unknown;
let _port: number;


const server = (function() {
    let _instance: ({
        expose: typeof expose;
        launch: typeof launch;
        shutdown: typeof shutdown;
    });
    let _express: Express;
    let _inner: unknown;
    let _port: number;

    function expose(url: string, hook: (request: Request, response: Response) => void) {
        _express.get(url, hook);
        return _instance;
    }

    function launch(port: bigint) {
        _inner = _express.listen(Number(port));
        return _instance;
    }

    function shutdown() {
        (_inner as any).close();
    }

    return function() {
        if (!_instance) return _instance = ({
            expose,
            launch,
            shutdown
        });
        return _instance;
    }
})();

server()
    .expose("/", functin() {})
    .expose()
    .expose()
    .launch()
    .shutdown();