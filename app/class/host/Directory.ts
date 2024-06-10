import { type IDirectory } from "./IDirectory.ts";
import { type IPath } from "./IPath.ts";
import { type IFile } from "./file/IFile.ts";
import { isIFile } from "./file/IFile.ts";
import { isIDirectory } from "./IDirectory.ts";
import { Path } from "./Path.ts";
import FileSystem from "fs";
import * as TsResult from "ts-results";
import { join } from "path";
import { File } from "./file/File.ts";

export function Directory(_path: IPath): IDirectory {
    const _: IDirectory = { 
        path, 
        childPaths, 
        childDirectories, 
        childFiles, 
        children, 
        searchFor 
    };
    
    function path(): IPath {
        return _path;
    }

    function childPaths(): IPath[] {
        const result: IPath[] = [];
        FileSystem.readdirSync(path().toString()).forEach(path => result.push(Path(path)));
        return result;
    }

    function childDirectories(): TsResult.Result<IDirectory[], unknown> {
        try {
            const result: IDirectory[] = [];
            childPaths().forEach(childPath => {
                if (!childPath.isDirectory().unwrapOr(false)) {
                    return;
                }
                result.push(Directory(childPath));
            });
            return TsResult.Ok<IDirectory[]>(result);
        }
        catch (error: unknown) {
            return TsResult.Err<unknown>(error);
        }
    }

    function childFiles(): TsResult.Result<IFile[], unknown> {
        try {
            const result: IFile[] = [];
            childPaths().forEach(childPath => {
                const joined: string = join(path().toString(), childPath.toString());
                const joinedPath: IPath = Path(joined);
                if (!joinedPath.isFile().unwrapOr(false)) {
                    return;
                }
                result.push(File(joinedPath));
            });
            return TsResult.Ok<IFile[]>(result);
        }
        catch (error: unknown) {
            return TsResult.Err<unknown>(error);
        }
    }

    function children(): (IFile | IDirectory)[] {
        return [...childDirectories().unwrapOr([]), ...childFiles().unwrapOr([])];
    }

    function searchFor({ fileName, fileExtension }: { fileName: string; fileExtension: string; }): TsResult.Option<IFile> {
        for (const child of children()) {
            if (isIFile(child)) {
                if (child.name().unwrapOr(undefined) === fileName && child.extension().unwrapOr(undefined) === fileExtension) {
                    return TsResult.Some<IFile>(child);
                }
            }
            if (isIDirectory(child)) {
                const found: TsResult.Option<IFile> = child.searchFor({ fileName, fileExtension });
                if (found.some) {
                    return found;
                }
            }
        }
        return TsResult.None;
    }

    return _;
}