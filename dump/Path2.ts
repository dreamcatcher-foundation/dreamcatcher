import {} from "../code/build/haruka/app/lib/Toolkit.ts";
import {statSync, readFileSync} from "fs";
import {join as joinPath} from "path";

export interface Path {
    isFile: () => boolean;
    isDirectory: () => boolean;
    get: () => string;
    name: () => 
        | string
        | null;
    extension: () => 
        | string
        | null;
    directoryPath: () =>
        | Path
        | null;
    content: (
        encoding:
            | "ascii"
            | "base64"
            | "base64url"
            | "binary"
            | "hex"
            | "latin1"
            | "ucs2"
            | "utf8"
            | "utf16le"
    ) => string;
    join: (
        _pathLike:
            | string
            | Path
    ) => Path;
}

export function Path(
    _pathLike:
        | string
        | Path
): Path {
    const instance = {
        isFile,
        isDirectory,
        get,
        name,
        extension,
        directoryPath,
        content,
        join
    };
    let _inner: string = "";

    (function() {
        _inner = format(_pathLike);
    })();

    function isFile(): boolean {
        return statSync(get()).isFile();
    }

    function isDirectory(): boolean {
        return statSync(get()).isDirectory();
    }

    function get(): string {
        return _inner;
    }

    function name():
        | string
        | null {
        return get()
            ?.split("/")
            ?.pop()
            ?.split(".")
            ?.at(-2) || null;
    }

    function extension():
        | string
        | null {
        const shards: string[] = get()
            ?.split("/")
            ?.pop()
            ?.split(".") ?? [];
        if (shards.length < 2) {
            return null;
        }
        return shards.at(-1) ?? null;
    }

    function directoryPath():
        | Path
        | null {
        if (isFile()) {
            let result: string = "";
            const shards = get()?.split("/");
            shards?.pop();
            shards.forEach(shard => result += `${shard}/`);
            return result === "" ? null : Path(result);
        }
        return null;
    }

    function content(
        encoding:
            | "ascii"
            | "base64"
            | "base64url"
            | "binary"
            | "hex"
            | "latin1"
            | "ucs2"
            | "utf8"
            | "utf16le"
    ): string {
        return readFileSync(get(), encoding);
    }

    function join(
        pathLike:
            | string
            | Path
    ): Path {
        _inner = joinPath(get(), format(pathLike));
        return instance;
    }

    function format(
        pathLike:
            | string
            | Path
    ): string {
        switch (typeof pathLike) {
            case "object": return pathLike.get();
            case "string": return pathLike;
        }
    }

    return instance;
}


function merge<Instance extends object>(...instances: Instance[]): Instance {
    return instances.reduce((acc, obj) => ({ ...acc, ...obj }), {} as Instance);
}

// Example usage:
const mergedInstance = merge(
    { name: "Alice", age: 30 },
    { age: 25 },
    { city: "New York" }
);


function inherit<T extends object>(...objects: T[]): T {
    const mergedObject: Partial<T> = {};
    objects.forEach(obj => {
        for (const prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                mergedObject[prop] = obj[prop];
            }
        }
    });
    return mergedObject as T;
}

const instance = inherit(
    Path(""),
    {
        name: "Joe"
    }
);





instance.extension()



const x = {...Path(""), ...{hello: ""}};








export default class Paths {
    private _inner: string = "";

    public constructor(pathish: string | Path) {
        this._inner = Path.toString(pathish);
    }

    public static toString(pathish: string | Path): string {
        return pathish instanceof Path
            ? pathish.get()
            : pathish;
    }

    public isFile(): boolean {
        return statSync(this.get()).isFile();
    }

    public isDirectory(): boolean {
        return statSync(this.get()).isDirectory();
    }

    public get(): string {
        return this._inner;
    }

    public name(): string | null {
        return this
            .get()
            ?.split("/")
            ?.pop()
            ?.split(".")
            ?.at(-2) || null;
    }

    public extension(): string | null {
        const shards: string[] = this
            .get()
            ?.split("/")
            ?.pop()
            ?.split(".") ?? [];
        if (shards.length < 2) {
            return null;
        }
        return shards.at(-1) ?? null;
    }

    public directoryPath(): Path | null {
        if (this.isFile()) {
            let result: string = "";
            const shards = this
                .get()
                ?.split("/");
            shards?.pop();
            shards.forEach((shard) => result += `${shard}/`);
            return result == "" ? null : new Path(result);
        }
        return null;
    }

    public content(
        encoding:
        | "ascii"
        | "base64"
        | "base64url"
        | "binary"
        | "hex"
        | "latin1"
        | "ucs2"
        | "utf8"
        | "utf16le"
    ): string {
        return readFileSync(this.get(), encoding);
    }

    public join(pathish: string | Path): this {
        this._inner = joinPath(this.get(), Path.toString(pathish));
        return this;
    }

    protected _onlyExtensions(extensions: string[]): this {
        let validExtensionsLength: number = 0;
        extensions.forEach(extension => {
            if (this.extension() == extension) {
                validExtensionsLength += 1;
            }
        })
        if (validExtensionsLength == 0) {
            throw new Error(`Path: invalid extension >>> expected ${extensions} but got ${this.extension()}`);
        }
        return this;
    }
}