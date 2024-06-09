import * as TsResult from "ts-results";

export interface IPath {
    toString(): string;
    exists(): TsResult.Result<boolean, unknown>;
    isFile(): TsResult.Result<boolean, unknown>;
    isDirectory(): TsResult.Result<boolean, unknown>;
}