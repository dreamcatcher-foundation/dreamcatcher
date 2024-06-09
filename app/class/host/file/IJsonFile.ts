import { type IFile } from "./IFile.ts";
import * as TsResult from "ts-results";

export interface IJsonFile extends IFile {
    set(k: string, item: unknown): TsResult.Result<IJsonFile, unknown>;
    get<Item>(k: string): TsResult.Result<Item, unknown>;
}