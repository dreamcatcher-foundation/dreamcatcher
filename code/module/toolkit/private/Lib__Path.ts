import {statSync} from "fs";
import {readFileSync} from "fs";
import {writeFileSync} from "fs";
import {unlinkSync} from "fs";
import {join} from "path";
import {Url} from "../web/Url.ts";
//import {execSync} from "child_process";
import {exec} from "child_process";
import {type ChildProcess} from "child_process";
import {Timer} from "./Timer.ts";
import solc from "solc";

type PathLike = string | Path;

class Path {
    private _inner: string;

    public constructor(pathLike: PathLike) {
        this._inner = Path.toString(pathLike);
    }

    public static toString(pathLike: PathLike): string {
        return pathLike instanceof Path
            ? pathLike.get()
            : pathLike;
    }

    public isFile(): boolean {
        return statSync(this.get()).isFile();
    }

    public isDir(): boolean {
        return statSync(this.get()).isDirectory();
    }

    public get(): string {
        return this._inner;
    }

    public name(): string | null {
        return this.get()
            ?.split("/")
            ?.pop()
            ?.split(".")
            ?.at(-2) || null;
    }

    public extension(): string | null {
        const shards: string[] = this.get()
            ?.split("/")
            ?.pop()
            ?.split(".") ?? [];
        if (shards.length < 2) {
            return null;
        }
        return shards.at(-1) ?? null;
    }

    public dir(): Path | null {
        if (this.isFile()) {
            let result: string = "";
            const shards = this.get()
                ?.split("/");
            shards?.pop();
            for (let i = 0; i < shards.length; i++) {
                const shard = shards[i];
                result += `${shard}/`;
            }
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

    public join(pathLike: string | Path): this {
        this._inner = join(this.get(), Path.toString(pathLike));
        return this;
    }
}

class HyperTextMarkupLanguagePath extends Path {
    public constructor(pathLike: PathLike) {
        super(pathLike);
        if (this.extension() != "html") {
            throw new Error(`HyperTextMarkupLanguagePath: Invalid extension. Expected 'html' but got '${this.extension()}'`);
        }
    }

    public expose(urlLike: string | Url): void {
        if (urlLike instanceof Url) {
            urlLike.exposePath(this.get());
            return;
        }
        new Url(urlLike).exposePath(this.get());
        return;
    }
}

class JavaScriptObjectNotationPath extends Path {
    public constructor(pathLike: PathLike) {
        super(pathLike);
        if (this.extension() != "json") {
            throw new Error(`JavaScriptObjectNotationPath: Invalid extension. Expected 'json' but got '${this.extension()}'`);
        }
    }

    public load(): unknown {
        return JSON.parse(this.content("utf8"));
    }

    public save(object: object): void {
        writeFileSync(this.get(), JSON.stringify(object));
        return;
    } 
}

class TypescriptPath extends Path {
    public constructor(pathLike: string | Path) {
        super(pathLike);
        if (this.extension() != "ts" && this.extension() != "tsx") {
            throw new Error(`TypescriptPath: Invalid extension. Expected 'ts' or 'tsx' but got '${this.extension()}'`);
        }
    }

    public async transpile(outDirPathLike?: string | Path): Promise<ChildProcess> {
        const path: string = Path.toString(outDirPathLike ?? "");
        if (!path) {
            const command: string = `bun build ${this.get()} --outdir ${this.dir()?.get()}`;
            console.log(command);
            return exec(command);
        }
        const command: string = `bun build ${this.get()} --outdir ${this.get()}`;
        return exec(command);
    }
}

class SolidityPath extends Path {
    public constructor(pathLike: PathLike) {
        super(pathLike);
        if (this.extension() != "sol") {
            throw new Error(`SolidityPath: Invalid extension. Expected 'sol' but got '${this.extension()}'`);
        }
    }

    public override name(): string {
        if (!super.name) {
            throw new Error(`SolidityPath: Requires a file name but failed to extract one from its path.`);
        }
        return super.name()!;
    }

    public flattenedSolidityPath(): string {
        return `${__dirname}/${this.name()}.${this.extension()}`;
    }

    public override content(): string {
        exec(`bun hardhat flatten ${this.get()} > ${this.flattenedSolidityPath()}`);
        Timer.sleepSync(500n);
        const content: string = readFileSync(this.flattenedSolidityPath(), "utf8");
        unlinkSync(this.flattenedSolidityPath());
        return content;
    }

    public errors(): string[] {
        try {
            let errors: string[] = [];
            for (let i = 0; i < this._output().errors.length; i++) {
                if (this._output().errors[i].severity == "error") {
                    errors.push(this._output().errors[i].formattedMessage);
                }
            }
            return errors;
        }
        catch {
            return [];
        }
    }

    public warnings(): string[] {
        try {
            let warnings: string[] = [];
            for (let i = 0; i < this._output().errors.length; i++) {
                if (this._output().errors[i].severity != "error") {
                    warnings.push(this._output().errors[i].formattedMessage);
                }
            }
            return warnings;
        }
        catch {
            return [];
        }
    }

    public bytecode(): string {
        try {
            if (this.errors().length == 0) {
                return this
                    ._output()
                    ?.contracts
                    ?.[this.name()]
                    ?.[this.name()]
                    ?.evm
                    ?.bytecode
                    ?.object ?? "";
            }
            return "";
        }
        catch {
            return "";
        }
    }

    public abstractBinaryInterface(): object[] {
        try {
            if (this.errors().length == 0) {
                return this
                    ._output()
                    ?.contracts
                    ?.[this.name()]
                    ?.[this.name()]
                    ?.abi ?? [];
            }
            return [];
        }
        catch {
            return [];
        }
    }

    public methods(): object {
        try {
            if (this.errors().length == 0) {
                return this
                    ._output()
                    ?.contracts
                    ?.[this.name()]
                    ?.[this.name()]
                    ?.evm
                    ?.methodIdentifiers ?? {};
            }
            return {};
        }
        catch {
            return {};
        }
    }

    private _output(): any {
        const solcIn = {
            "language": "Solidity",
            "sources": {
                [this.name()]: {
                    "content": this.content()
                }
            },
            "settings": {
                "outputSelection": {
                    "*": {
                        "*": [
                            "abi",
                            "evm.bytecode",
                            "evm.methodIdentifiers"
                        ]
                    }
                }
            }
        }
        const solcInString: string = JSON.stringify(solcIn);
        const compiled: any = solc.compile(solcInString);
        return JSON.parse(compiled);
    }
}

export type {PathLike};
export {Path};
export {HyperTextMarkupLanguagePath};
export {JavaScriptObjectNotationPath};
export {TypescriptPath};
export {SolidityPath};