import { Path } from "@atlas/shared/os/Path.ts";
import { File } from "@atlas/shared/os/File.ts";
import { Result } from "ts-results";
import { Option } from "ts-results";
import { Some } from "ts-results";
import { None } from "ts-results";
import { Ok } from "ts-results";
import { Err } from "ts-results";
import { readdirSync } from "fs";
import { join } from "path";

class Directory {
    public constructor(private _path: Path) {}

    public path(): Path {
        return this._path;
    }

    public paths(): Path[] {
        let result: Path[] = [];
        readdirSync(this.path().toString()).forEach(path => result.push(new Path(path)));
        return result;
    }

    public directories(): Result<Directory[], unknown> {
        try {
            let result: Directory[] = [];
            this.paths().forEach(path => {
                if (!path.isDirectory().unwrapOr(false)) {
                    return;
                }
                result.push(new Directory(path));
            });
            return new Ok<Directory[]>(result);
        }
        catch (error: unknown) {
            return new Err<unknown>(error);
        }
    }

    public files(): Result<File[], unknown> {
        try {
            let result: File[] = [];
            this.paths().forEach(path => {
                let joinedPathString: string = join(this.path().toString(), path.toString());
                let joinedPath: Path = new Path(joinedPathString);
                if (!joinedPath.isFile().unwrapOr(false)) {
                    return;
                }
                result.push(new File(joinedPath));
            });
            return new Ok<File[]>(result);
        }
        catch (error: unknown) {
            return new Err<unknown>(error);
        }
    }

    public children(): (File | Directory)[] {
        return [...this.directories().unwrapOr([]), ...this.files().unwrapOr([])];
    }

    public lookfor(name: string, extension: string): Option<File> {
        for (let child of this.children()) {
            if (child instanceof File) {
                if (child.name().unwrapOr(undefined) === name && child.extension().unwrapOr(undefined) === extension) {
                    return new Some<File>(child);
                }
            }
            if (child instanceof Directory) {
                let found: Option<File> = child.lookfor(name, extension);
                if (found.some) {
                    return found;
                }
            }
        }
        return None;
    }
}

export { Directory };