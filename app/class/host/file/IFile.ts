import { type IPath } from "../IPath.ts";
import { type IDirectory } from "../IDirectory.ts";
import * as TsResult from "ts-results";

export interface IFile {
    path(): IPath;
    name(): TsResult.Option<string>;
    extension(): TsResult.Option<string>;
    directory(): TsResult.Option<IDirectory>;
    content(): TsResult.Result<Buffer, unknown>;
    remove(): TsResult.Result<void, unknown>;
    create({ override }: { override?: boolean; }): TsResult.Result<void, unknown>;
}

export function isIFile(object: any): object is IFile {
    return (
        object &&
        typeof object.path === "function" &&
        typeof object.name === "function" &&
        typeof object.extension === "function" &&
        typeof object.directory === "function" &&
        typeof object.content === "function" &&
        typeof object.remove === "function" &&
        typeof object.create === "function"
    );
}

export function isValidExtension(file: IFile, extension: string): boolean {
    if (file.extension().unwrapOr(undefined) !== extension) {
        return false;
    }
    return true;
}