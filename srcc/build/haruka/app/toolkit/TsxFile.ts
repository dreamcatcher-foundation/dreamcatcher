import type { IDirectory } from "@HarukaToolkitBundle";
import type { IFile } from "@HarukaToolkitBundle";
import type { IPath } from "@HarukaToolkitBundle";
import { File } from "@HarukaToolkitBundle";
import { Result } from "@HarukaToolkitBundle";
import { Err } from "@HarukaToolkitBundle";
import { Ok } from "@HarukaToolkitBundle";
import { execSync } from "@HarukaToolkitBundle";

interface ITsxFile extends IFile {
    transpile({directory}: {directory?: IDirectory}): Result<Buffer, unknown>;
}

function TsxFile({path}: {path: IPath}): Result<ITsxFile, unknown> {
    let self: ITsxFile = {
        ...File({path: path}),
        transpile
    };

    if (self.extension().unwrapOr(undefined) !== "tsx") {
        return Err<string>("TSXFile: Incompatible extension.");
    }

    function transpile({directory}: {directory?: IDirectory}) {
        try {
            if (!directory) {
                if (self.directory().none) {
                    return Err("TSXFile: Unable to find parent directory.")
                }
                return Ok<Buffer>(execSync(`bun build ${self.path().toString()} --outdir ${self.directory().unwrap().path().toString()}`));
            }
            return Ok<Buffer>(execSync(`bun build ${self.path().toString()} --outdir ${directory.path().toString()}`));
        }
        catch (error: unknown) {
            return Err<unknown>(error);
        }
    }

    return Ok<ITsxFile>(self);
}

export type { ITsxFile };
export { TsxFile };