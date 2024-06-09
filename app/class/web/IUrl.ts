import { type AxiosResponse } from "axios";
import * as TsResult from "ts-results";

export interface IUrl {
    toString(): string;
    response(): Promise<TsResult.Result<AxiosResponse, unknown>>;
    post(
        item:
        | object
        | undefined
    ): Promise<TsResult.Result<AxiosResponse, unknown>>;
}