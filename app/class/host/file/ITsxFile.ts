import { type IFile } from "./IFile.ts";
import { type IDirectory } from "../IDirectory.ts";
import * as TsResult from "ts-results";

export interface ITsxFile {
    transpile({ directory }: { directory?: IDirectory }): TsResult.Result<Buffer, unknown>;
}