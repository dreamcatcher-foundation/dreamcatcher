import { type AxiosResponse } from "axios";
import { Result } from "ts-results";
import { Ok } from "ts-results";
import { Err } from "ts-results";
import axios from "axios";

class Url {
    public constructor(private _string: string) {}

    public toString(): string {
        return this._string;
    }

    public async response(): Promise<Result<AxiosResponse, unknown>> {
        try {
            return new Ok<AxiosResponse>(await axios.get(this.toString()));
        }
        catch (error: unknown) {
            return new Err<unknown>(error);
        }
    }

    public async post(item: object | undefined = undefined): Promise<Result<AxiosResponse, unknown>> {
        try {
            return new Ok<AxiosResponse>(await axios.post(this.toString(), item));
        }
        catch (error: unknown) {
            return new Err<unknown>(error);
        }
    }
}

export { Url };