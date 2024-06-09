import { type IFile } from "./IFile.ts";
import { type IPath } from "../IPath.ts";
import { type IDirectory } from "../IDirectory.ts";
import { Directory } from "../Directory.ts";
import { Path } from "../Path.ts";
import * as TsResult from "ts-results";
import * as FileSystem from "fs";

export function File(_path: IPath): IFile {
    const _: IFile = { path, name, extension, directory, content, remove, create };

    function path(): IPath {
        return _path;
    }

    function name(): TsResult.Option<string> {
        const result:
        | string
        | undefined
            = path().toString()
                ?.split("/")
                ?.pop()
                ?.split(".")
                ?.at(-2);
        if (!result) {
            return TsResult.None;
        }
        return TsResult.Some<string>(result);
    }

    function extension(): TsResult.Option<string> {
        const shards: string[]
            = path().toString()
                ?.split("/")
                ?.pop()
                ?.split(".") ?? [];
        if (shards.length < 2) {
            return TsResult.None;
        }
        const result:
        | string
        | undefined
            = shards.at(-1);
        if (!result) {
            return TsResult.None;
        }
        return TsResult.Some<string>(result);
    }

    function directory(): TsResult.Option<IDirectory> {
        if (!_exists()) {
            return TsResult.None;
        }
        let result: string = "";
        const shards: string[]
            = path().toString()
                ?.split("/");
        shards
            ?.pop();
        shards.forEach(shard => result += shard + "/");
        if (result === "") {
            return TsResult.None;
        }
        return TsResult.Some<IDirectory>(Directory({ _path: Path({ _string: result })}));
    }

    function content(): TsResult.Result<Buffer, unknown> {
        if (!_exists()) {
            return TsResult.Err<string>("PathNotFound");
        }
        try {
            return TsResult.Ok<Buffer>(FileSystem.readFileSync(path().toString()));
        }
        catch (error: unknown) {
            return TsResult.Err<unknown>(error);
        }
    }

    function remove(): TsResult.Result<void, unknown> {
        if (!_exists()) {
            return TsResult.Err<string>("PathNotFound");
        }
        try {
            return TsResult.Ok<void>(FileSystem.unlinkSync(path().toString()));
        }
        catch (error: unknown) {
            return TsResult.Err<unknown>(error);
        }
    }

    function create({ override=false }: { override?: boolean }): TsResult.Result<void, unknown> {
        try {
            /**
             * If any failure occurs during the exists process by default process will assume that the file exists as to not override
             * important data if anything goes wrong. Only when the process functions properly and is sure that the file does nto exist
             * will it be generated and overriden by default.
             */
            if (!_exists()) {
                return TsResult.Ok<void>(FileSystem.writeFileSync(path().toString(), ""));
            }
            else {
                /** Must give explicit permission to override the file if it exists. */
                if (override) {
                    return TsResult.Ok<void>(FileSystem.writeFileSync(path().toString(), ""));
                }
                /**
                 * No action was performed because the file exists and
                 * override permission was not given. Gracefully passes
                 * this outcome as an error.
                 */
                return TsResult.Err<string>("Forbidden");
            }
        }
        catch (error: unknown) {   
            return TsResult.Err<unknown>(error);
        }
    }

    function _exists(): boolean {
        return path().exists().unwrapOr(false);
    }

    return _;
}