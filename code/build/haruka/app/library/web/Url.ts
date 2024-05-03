import axios, {type AxiosResponse} from "axios";
import {type Request, type Response} from "express";
import Server from "./Server.ts";
import Path from "../os/path/Path.ts";

export default class Url {
    private _inner: string;

    public constructor(urlish: string | Url) {
        this._inner = Url.toString(urlish);
    }

    public static toString(urlish: string | Url): string {
        return urlish instanceof Url
            ? urlish.get()
            : urlish;
    }

    public get(): string {
        return this._inner;
    }

    public async response(): Promise<AxiosResponse> {
        return axios.get(this.get());
    }

    public async send(object?: object): Promise<AxiosResponse> {
        return axios.post(this.get(), object);
    }

    public expose(listener: (request: Request, response: Response) => void): this {
        Server
            .express()
            .get(this.get(), listener);
        return this;
    }

    public exposePath(pathish: string | Path): this {
        this.expose((request, response) => {
            response.sendFile(Path.toString(pathish));
            return;
        });
        return this;
    }

    public exposeItem(item: object | object[]): this {
        this.expose((request, response) => {
            response.send(item);
            return;
        });
        return this;
    }
}