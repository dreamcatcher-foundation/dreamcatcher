import {statSync, readFileSync} from "fs";
import {join} from "path";

export class FailedToFetchContentError extends Error {}

export default class Path {
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
        this._inner = join(this.get(), Path.toString(pathish));
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