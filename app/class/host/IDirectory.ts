import { type IPath } from "./IPath.ts";
import { type IFile } from "./file/IFile.ts";
import * as TsResult from "ts-results";

export interface IDirectory {
    path(): IPath;
    childPaths(): IPath[];
    childDirectories(): TsResult.Result<IDirectory[], unknown>;
    childFiles(): TsResult.Result<IFile[], unknown>;
    children(): (IFile | IDirectory)[];
    searchFor({ fileName, fileExtension }: { fileName: string; fileExtension: string; }): TsResult.Option<IFile>;
}