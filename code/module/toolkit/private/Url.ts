import type {AxiosResponse} from "axios";
import type {Request} from "express";
import type {Response} from "express";
import type {ServerListener} from "./Server.ts";
import type {PathLike} from "./Lib__Path.ts";
import axios from "axios";
import {Path} from "./Lib__Path.ts";
import {Server} from "./Server.ts";

class Url {
    private _inner: string;

    public constructor(urlLike: string | Url) {
        this._inner = Url.toString(urlLike);
    }

    public static toString(urlLike: string | Url): string {
        return urlLike instanceof Url
            ? urlLike.get()
            : urlLike;
    }

    public get(): string {
        return this._inner;
    }

    public async response(): Promise<AxiosResponse> {
        return axios.get(this.get());
    }

    public async post(item?: object): Promise<AxiosResponse> {
        return axios.post(this.get(), item);
    }

    public expose(serverListener: ServerListener): this {
        Server.express().get(this.get(), serverListener);
        return this;
    }

    public exposePath(pathLike: PathLike): this {
        this.expose(function(request, response) {
            response.sendFile(Path.toString(pathLike));
            return;
        })
        return this;
    }

    public exposeItem(item: object | object[]): this {
        this.expose(function(request, response) {
            response.send(item);
            return;
        });
        return this;
    }
}

export {Url};