import { type IFile } from "./IFile.ts";
import { type IDirectory } from "../IDirectory.ts";
import * as TsResult from "ts-results";

export interface ITsxFile extends IFile {
    transpile({ directory }: { directory?: IDirectory }): TsResult.Result<Buffer, unknown>;
}

export function isITsxFile(item: any): item is ITsxFile {
    return item && typeof item.transpile === "function";
} 