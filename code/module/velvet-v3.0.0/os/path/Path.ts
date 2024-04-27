import {statSync} from "fs";
import {join} from "path";

export default class Path {
    protected _value: string;

    public constructor(path: string | Path) {
        this._value = path instanceof Path 
            ? path.value() 
            : path; 
    }

    public value(): string {
        return structuredClone(this._value);
    }

    public name(): string | null {
        return this
            .value()
            ?.split("/")
            ?.pop()
            ?.split(".")
            ?.at(-2) || null;
    }

    public extension(): string | null {
        const shards: string[] = this
            .value()
            ?.split("/")
            ?.pop()
            ?.split(".") ?? [];
        return shards.length < 2 ? null : shards.at(-1) ?? null;
    }
    
    public isFile(): boolean {
        return statSync(this.value()).isFile();
    }

    public isDir(): boolean {
        return statSync(this.value()).isDirectory();
    }

    public join(path: string | Path): this {
        this._value = path instanceof Path
            ? join(this.value(), path.value())
            : join(this.value(), path);
        return this;
    }

    public dir(): Path | null {
        if (this.isFile()) {
            let result: string = "";
            const shards = this
                .value()
                ?.split("/");
            shards?.pop();
            shards.forEach((shard: string) => result += `${shard}/`);
            return result == ""
            ? null
            : new Path(result); 
        }
        return null;
    }
}