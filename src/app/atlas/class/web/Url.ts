import { type AxiosResponse } from "axios";
import * as TsResult from "ts-results";
import axios from "axios";

export abstract class IUrl {
    public abstract toString(): string;
    public abstract response(): Promise<TsResult.Result<AxiosResponse, unknown>>;
    public abstract post(
        item:
            | object
            | undefined
    ): Promise<TsResult.Result<AxiosResponse, unknown>>;
}

export class Url implements IUrl {
    public constructor(private _string: string) {}

    public toString(): string {
        return this._string;
    }

    public async response(): Promise<TsResult.Result<AxiosResponse, unknown>> {
        try {
            return new TsResult.Ok<AxiosResponse>(await axios.get(this.toString()));
        }
        catch (error: unknown) {
            return new TsResult.Err<unknown>(error);
        }
    }

    public async post(item: object | undefined = undefined): Promise<TsResult.Result<AxiosResponse, unknown>> {
        try {
            return new TsResult.Ok<AxiosResponse>(await axios.post(this.toString(), item));
        }
        catch (error: unknown) {
            return new TsResult.Err<unknown>(error);
        }
    }
}