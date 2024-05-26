import { Ok } from "@HarukaToolkitBundle";
import { Err } from "@HarukaToolkitBundle";
import { Result } from "@HarukaToolkitBundle";
import { existsSync } from "@HarukaToolkitBundle";
import { statSync } from "@HarukaToolkitBundle";

interface IPath {
    toString(): string;
    exists(): Result<boolean, unknown>;
    isFile(): Result<boolean, unknown>;
    isDirectory(): Result<boolean, unknown>;
}

function Path({string}: {string: string}): IPath {
    let self: IPath = {
        toString,
        exists,
        isFile,
        isDirectory
    };
    let _string: string;

    (function(): void {
        _string = string;
    })();

    function toString(): string {
        return _string;
    }

    function exists(): Result<boolean, unknown> {
        try {
            return Ok<boolean>(existsSync(toString()));
        }
        catch (error: unknown) {
            return Err<unknown>(error);
        }
    }

    function isFile(): Result<boolean, unknown> {
        if (!exists().unwrapOr(false)) {
            return Err<string>("Path: File not found.");
        }
        try {
            return Ok<boolean>(statSync(toString()).isFile());
        }
        catch (error: unknown) {
            return Err<unknown>(error);
        }
    }

    function isDirectory(): Result<boolean, unknown> {
        if (!exists().unwrapOr(false)) {
            return Err<string>("Path: File not found.");
        }
        try {
            return Ok<boolean>(statSync(toString()).isDirectory());
        }
        catch (error: unknown) {
            return Err<unknown>(error);
        }
    }

    return self;
}

export type { IPath };
export { Path };