import type { IPath } from "@HarukaToolkitBundle";
import type { IDirectory } from "@HarukaToolkitBundle";
import { Path } from "@HarukaToolkitBundle";
import { Result } from "@HarukaToolkitBundle";
import { Option } from "@HarukaToolkitBundle";
import { Some } from "@HarukaToolkitBundle";
import { None } from "@HarukaToolkitBundle";
import { Err } from "@HarukaToolkitBundle";
import { Ok } from "@HarukaToolkitBundle";
import { Directory } from "@HarukaToolkitBundle";
import { readFileSync } from "@HarukaToolkitBundle";
import { writeFileSync } from "@HarukaToolkitBundle";
import { unlinkSync } from "@HarukaToolkitBundle";

interface IFile {
    path(): IPath;
    name(): Option<string>;
    extension(): Option<string>;
    directory(): Option<IDirectory>;
    content(): Result<Buffer, unknown>;
    remove(): Result<void, unknown>;
    create({override}: {override?: boolean}): Result<void, unknown>;
}

function File(args: {path: IPath}) {
    let self: IFile = {
        path,
        name,
        extension,
        directory,
        content,
        remove,
        create
    };
    let _path: IPath;

    (function() {
        _path = args.path;
    })();

    function path(): IPath {
        return _path;
    }

    function name(): Option<string> {
        let result: string | undefined
            = path().toString()
                ?.split("/")
                ?.pop()
                ?.split(".")
                ?.at(-2);
        if (!result) {
            return None;
        }
        return Some<string>(result);
    }

    function extension(): Option<string> {
        let shards: string[]
            = path().toString()
                ?.split("/")
                ?.pop()
                ?.split(".") ?? [];
        if (shards.length < 2) {
            return None;
        }
        let result: string | undefined = shards.at(-1);
        if (!result) {
            return None;
        }
        return Some<string>(result);
    }

    function directory(): Option<IDirectory> {
        if (!path().exists().unwrapOr(false)) {
            return None;
        }
        let result: string = "";
        let shards: string[]
            = path().toString()
                ?.split("/");
        shards
            ?.pop();
        shards.forEach(shard => result += (shard + "/"));
        if (result === "") {
            return None;
        }
        return Some<IDirectory>(Directory({path: Path({string: result})}));
    }

    function content(): Result<Buffer, unknown> {
        if (!path().exists().unwrapOr(false)) {
            return Err<string>("File: Path not found.");
        }
        try {
            return Ok<Buffer>(readFileSync(path().toString())); 
        }
        catch (error: unknown) {
            return Err<unknown>(error);
        }
    }

    function remove(): Result<void, unknown> {
        if (!path().exists().unwrapOr(false)) {
            return Err<string>("File: Path not found.");
        }
        try {
            return Ok<void>(unlinkSync(path().toString()));
        }
        catch (error: unknown) {
            return Err<unknown>(error);
        }
    }
    

    function create({override=false}: {override?: boolean}): Result<void, unknown> {
        try {
            /**
             * NOTE If any failure occurs during the exists process by default
             *      process will assume that the file exists as to not override
             *      important data if anything goes wrong. Only when the process
             *      functions properly and is sure that the file does nto exist
             *      will it be generated and overriden by default.
             */
            if (!path().exists().unwrapOr(false)) {
                return Ok<void>(writeFileSync(path().toString(), ""));
            }
            else {
                /**
                 * NOTE Must give explicit permission to override the file 
                 *      if it exists.
                 */
                if (override) {
                    return Ok<void>(writeFileSync(path().toString(), ""));
                }
                /**
                 * NOTE No action was performed because the file exists and
                 *      override permission was not given. Gracefully passes
                 *      this outcome as an error.
                 */
                return Err<string>("Forbidden");
            }
        }
        catch (error: unknown) {
            return Err<unknown>(error);
        }
    }

    return self;
}

export type { IFile };
export { File };