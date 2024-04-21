import type {Express, Request, Response} from "express";
import express from "express";
import {join} from "path";
import {ValueHook} from "./EventBusLib.ts";

export type Handler = (request: Request, response: Response) => unknown;

export type Endpoint = {
    url: string;
    handler: Handler;
};

let endpoints_: ValueHook<Endpoint[]> = ValueHook<Endpoint[]>("ServerLibEndpoints", []);
let express_: ValueHook<Express> = ValueHook<Express>("ServerLibExpress", express());
let server_: ValueHook<unknown> = ValueHook<unknown>("ServerLibServer", null);
let port_: ValueHook<number> = ValueHook<number>("ServerLibPort", 3000);

endpoints_.onChange(function() {

});

export function expose(url: string, handler: Handler) {

}
