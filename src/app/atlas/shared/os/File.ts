import { Path } from "@atlas/shared/os/Path.ts";
import { Directory } from "@atlas/shared/os/Directory.ts";
import { Result } from "ts-results";
import { Option } from "ts-results";
import { Some } from "ts-results";
import { None } from "ts-results";
import { Ok } from "ts-results";
import { Err } from "ts-results";
import { readFileSync } from "fs";
import { writeFileSync } from "fs";
import { unlinkSync } from "fs";
import { Breakable } from "@atlas/shared/trait/Breakable.ts";

class File extends Breakable {
    public constructor(private _path: Path, isBroken: boolean = false) {
        super(isBroken);
    }

    public path(): Path {
        return this._path;
    }

    public name(): Option<string> {
        let result: string | undefined
            = this.path().toString()
                ?.split("/")
                ?.pop()
                ?.split(".")
                ?.at(-2);
        if (!result) {
            return None;
        }
        return new Some<string>(result);
    }

    public extension(): Option<string> {
        let shards: string[]
            = this.path().toString()
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
        return new Some<string>(result);   
    }

    public directory(): Option<Directory> {
        if (!this.path().exists().unwrapOr(false)) {
            return None;
        }
        let result: string = "";
        let shards: string[]
            = this.path().toString()
                ?.split("/");
        shards
            ?.pop();
        shards.forEach(shard => result += (shard + "/"));
        if (result === "") {
            return None;
        }
        return new Some<Directory>(
            new Directory(
                new Path(result)
            )
        );
    }

    public content(): Result<Buffer, unknown> {
        if (!this.path().exists().unwrapOr(false)) {
            return new Err<string>("File: Path not found.");
        }
        try {
            return new Ok<Buffer>(readFileSync(this.path().toString()));
        }
        catch (error: unknown) {
            return new Err<unknown>(error);
        }
    }

    public delete(): Result<void, unknown> {
        if (!this.path().exists().unwrapOr(false)) {
            return new Err<string>("File: path not found.");
        }
        try {
            return new Ok<void>(unlinkSync(this.path().toString()));
        }
        catch (error: unknown) {
            return new Err<unknown>(error);
        }
    }

    public create(override: boolean = false): Result<void, unknown> {
        try {
            /**
             * NOTE If any failure occurs during the exists process by default
             *      process will assume that the file exists as to not override
             *      important data if anything goes wrong. Only when the process
             *      functions properly and is sure that the file does nto exist
             *      will it be generated and overriden by default.
             */
            if (!this.path().exists().unwrapOr(false)) {
                return new Ok<void>(writeFileSync(this.path().toString(), ""));
            }
            else {
                /**
                 * NOTE Must give explicit permission to override the file 
                 *      if it exists.
                 */
                if (override) {
                    return new Ok<void>(writeFileSync(this.path().toString(), ""));
                }
                /**
                 * NOTE No action was performed because the file exists and
                 *      override permission was not given. Gracefully passes
                 *      this outcome as an error.
                 */
                return new Err<string>("Forbidden");
            }
        }
        catch (error: unknown) {
            return new Err<unknown>(error);
        }
    }
}

export { File };