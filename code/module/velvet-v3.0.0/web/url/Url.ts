import type {AxiosResponse} from "axios";
import axios from "axios";
import Path from "../../os/path/Path.ts";
import type {Request} from "express";
import type {Response} from "express";
import Server from "../Server.ts";

export type ServerHook = (request: Request, response: Response) => any;

export default class Url {
    public constructor(private readonly _url: string) {}

    public get(): string {
        return this._url;
    }

    public async response(): Promise<AxiosResponse> {
        return axios.get(this._url);
    }

    public async post(item?: object): Promise<AxiosResponse> {
        return axios.post(this._url, item);
    }

    public expose(hook: ServerHook): this {
        Server.express().get(this._url, hook);
        return this;
    }

    public exposePath(path: Path): this {
        return this.expose(function(request, response) {
            response.sendFile(path.get());
            return;
        });
    }

    public exposeItem(item: object | object[]): this {
        return this.expose(function(request, response) {
            response.send(item);
            return;
        });
    }
}