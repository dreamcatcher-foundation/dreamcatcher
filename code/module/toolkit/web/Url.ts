import axios, {type AxiosResponse} from "axios";
import {type Request, type Response} from "express";
import type {PathLike} from "../os/path/Path.ts";

type UrlLike = string | Url;

type ServerListener = (request: Request, response: Response) => void;

class Url {
    private _inner: string;

    public constructor(urlStringOrUrl: string | Url) {
        this._inner = Url.toString(urlStringOrUrl);
    }

    public get(): string {
        return this._inner;
    }

    public async response(): Promise<AxiosResponse> {
        return axios.get(this.get());
    }

    public async post($item?: object): Promise<AxiosResponse> {
        return axios.post(this.get(), $item);
    }

    public expose(serverListener: ServerListener): void {}

    public exposePath(pathLike: PathLike) {}

    public exposeItem(item: object | object[]) {
        
    }

    public static toString(urlStringOrUrl: string | Url): string {
        return urlStringOrUrl instanceof Url
            ? urlStringOrUrl.get()
            : urlStringOrUrl;
    }
}

export type {UrlLike};
export type {ServerListener};
export {Url};