import { type IPath } from "../IPath.ts";
import { type IDirectory } from "../IDirectory.ts";
import * as TsResult from "ts-results";

export interface IFile {
    path(): IPath;
    name(): TsResult.Option<string>;
    extension(): TsResult.Option<string>;
    directory(): TsResult.Option<IDirectory>;
    content(): TsResult.Result<Buffer, unknown>;
    delete(): TsResult.Result<void, unknown>;
    create({ override }: { override?: boolean; }): TsResult.Result<void, unknown>;
}