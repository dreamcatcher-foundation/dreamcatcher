import type { IPath } from "@HarukaToolkitBundle";
import type { IFile } from "@HarukaToolkitBundle";
import { Path } from "@HarukaToolkitBundle";
import { Result } from "@HarukaToolkitBundle";
import { Option } from "@HarukaToolkitBundle";
import { Some } from "@HarukaToolkitBundle";
import { None } from "@HarukaToolkitBundle";
import { Err } from "@HarukaToolkitBundle";
import { Ok } from "@HarukaToolkitBundle";
import { readdirSync } from "@HarukaToolkitBundle";
import { File } from "@HarukaToolkitBundle";
import { join } from "@HarukaToolkitBundle";

interface IDirectory {
    path(): IPath;
    paths(): IPath[];
    directories(): Result<IDirectory[], unknown>;
    files(): Result<IFile[], unknown>;
    children(): (IFile | IDirectory)[];
    lookfor({name, extension}: {name: string; extension: string;}): Option<IFile>;
}

function Directory(args: {path: IPath}) {
    let self: IDirectory = {
        path,
        paths,
        directories,
        files,
        children,
        lookfor
    };
    let _path: IPath;

    (function() {
        _path = args.path;
    })();

    function path(): IPath {
        return _path;
    }

    function paths(): IPath[] {
        let result: IPath[] = [];
        readdirSync(path().toString()).forEach(path => result.push(Path({string: path})));
        return result;
    }

    function directories(): Result<IDirectory[], unknown> {
        try {
            let result: IDirectory[] = [];
            paths().forEach(path => {
                if (!path.isDirectory().unwrapOr(false)) {
                    return;
                }
                result.push(Directory({path: path}));
            });
            return Ok<IDirectory[]>(result);
        }
        catch (error: unknown) {
            return Err(error);
        }
    }

    function files(): Result<IFile[], unknown> {
        try {
            let result: IFile[] = [];
            paths().forEach(childPath => {
                let joinedPathString: string = join(path().toString(), childPath.toString());
                let joinedPath: IPath = Path({string: joinedPathString});
                if (joinedPath.isFile().unwrapOr(false)) {
                    result.push(File({path: joinedPath}));
                }
            });
            return Ok<IFile[]>(result);
        }
        catch (error: unknown) {
            return Err<unknown>(error);
        }
    }

    function children(): (IFile | IDirectory)[] {
        return [
            ...directories()
                .unwrapOr([]),
            ...files()
                .unwrapOr([])
        ];
    }

    function lookfor({name, extension}: {name: string; extension: string;}): Option<IFile> {
        for (let child of children()) {
            if (
                !!(child as IFile).content &&
                !!(child as IFile).create &&
                !!(child as IFile).directory &&
                !!(child as IFile).extension &&
                !!(child as IFile).name &&
                !!(child as IFile).path &&
                !!(child as IFile).remove
            ) {
                if (
                    (child as IFile).name().unwrapOr(undefined) === name &&
                    (child as IFile).extension().unwrapOr(undefined) === extension
                ) {
                    return Some<IFile>((child as IFile));
                }
            }
            if (
                !!(child as IDirectory).children &&
                !!(child as IDirectory).directories &&
                !!(child as IDirectory).files &&
                !!(child as IDirectory).lookfor &&
                !!(child as IDirectory).path &&
                !!(child as IDirectory).paths
            ) {
                let found: Option<IFile> = (child as IDirectory).lookfor({name: name, extension: extension});
                if (found.some) {
                    return found;
                }
            }
        }
        return None;
    }

    return self;
}

export type { IDirectory };
export { Directory };