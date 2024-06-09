import { type IPath } from "./IPath.ts";
import FileSystem from "fs";
import * as TsResult from "ts-results";

function Path({ _inner }: { _inner: string; }): IPath {
    const _i: IPath = { toString, exists, isFile, isDirectory };

    function toString(): string {
        return _inner;
    }

    function exists(): TsResult.Result<boolean, unknown> {
        try {
            return TsResult.Ok<boolean>(FileSystem.existsSync(toString()));
        }
        catch (error: unknown) {
            return TsResult.Err<unknown>(error);
        }
    }

    function isFile(): TsResult.Result<boolean, unknown> {
        if (!exists().unwrapOr(false)) {
            return TsResult.Err<string>("PathNotFound");
        }
        try {
            return TsResult.Ok<boolean>(FileSystem.statSync(toString()).isFile());
        }
        catch (error: unknown) {
            return TsResult.Err<unknown>(error);
        }
    }

    function isDirectory(): TsResult.Result<boolean, unknown> {
        if (!exists().unwrapOr(false)) {
            return TsResult.Err<string>("PathNotFound");
        }
        try {
            return TsResult.Ok<boolean>(FileSystem.statSync(toString()).isDirectory());
        }
        catch (error: unknown) {
            return TsResult.Err<unknown>(error);
        }
    }

    return _i;
}