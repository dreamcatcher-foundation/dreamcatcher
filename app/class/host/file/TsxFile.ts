import { type ITsxFile } from "./ITsxFile.ts";
import { type IPath } from "../IPath.ts";
import { type IDirectory } from "../IDirectory.ts";
import { File } from "./File.ts";
import { isValidExtension } from "./IFile.ts";
import * as TsResult from "ts-results";
import * as ChildProcess from "child_process";

export function TsxFile(_path: IPath): TsResult.Result<ITsxFile, unknown> {
    const _: ITsxFile = { ...File(_path), transpile };

    if (!isValidExtension(_, "tsx")) {
        return TsResult.Err<string>("InvalidExtension");
    }

    function transpile(directory?: IDirectory): TsResult.Result<Buffer, unknown> {
        if (!_exists()) {
            return TsResult.Err<string>("PathNotFound");
        }
        try {
            if (!directory) {
                if (_.directory().none) {
                    return TsResult.Err<string>("UnableToLocateParentDirectory");
                }
                return TsResult.Ok<Buffer>(ChildProcess.execSync(`bun build ${_.path().toString()} --outdir ${_.directory().unwrap().path().toString()}`));
            }
            return TsResult.Ok<Buffer>(ChildProcess.execSync(`bun build ${_.path().toString()} --outdir ${_.directory().unwrap().path().toString()}`));
        }
        catch (error: unknown) {
            return new TsResult.Err<unknown>(error);
        }
    }

    function _exists(): boolean {
        return _.path().exists().unwrapOr(false);
    }

    return TsResult.Ok<ITsxFile>(_);
}
