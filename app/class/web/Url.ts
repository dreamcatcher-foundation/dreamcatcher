import { type AxiosResponse } from "axios";
import { type IUrl } from "./IUrl.ts";
import * as TsResult from "ts-results";
import Axios from "axios";

export function Url(_string: string): IUrl {
    const _: IUrl = { toString, response, post };

    function toString(): string {
        return _string;
    }

    async function response(): Promise<TsResult.Result<AxiosResponse, unknown>> {
        try {
            return TsResult.Ok<AxiosResponse>(await Axios.get(toString()));
        }
        catch (error: unknown) {
            return TsResult.Err<unknown>(error);
        }
    }

    async function post({ item }: { item?: object; }): Promise<TsResult.Result<AxiosResponse, unknown>> {
        try {
            return TsResult.Ok<AxiosResponse>(await Axios.post(toString(), item));
        }
        catch (error: unknown) {
            return TsResult.Err<unknown>(error);
        }
    }

    return _;
}