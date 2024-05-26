import {Stats, statSync, readFileSync, readdirSync, writeFileSync, unlinkSync} from "fs";
import {join as joinPath} from "path";
import {exec} from "child_process";
import solc from "solc";

export class PathLike {
    public constructor(
        private readonly _value:
            | string
            | Path
    ) {}

    public toString(): string {
        switch (typeof this._value) {
            case "string": return this._value;
            case "object": return this._value.value();
        }
    }
}

export default class Path {
    private _value: string;

    public constructor(pathLike: PathLike) {
        this._value = pathLike.toString();
    }

    public isFile(): boolean {
        const value: string = this.value();
        const stats: Stats = statSync(value);
        const isFile: boolean = stats.isFile();
        return isFile;
    }

    public isFolder(): boolean {
        const value: string = this.value();
        const stats: Stats = statSync(value);
        const isFolder: boolean = stats.isDirectory();
        return isFolder;
    }

    public value(): string {
        const value: string = this._value;
        return value;
    }

    public size(): number {
        const value: string = this.value();
        const stats: Stats = statSync(value);
        const size: number = stats.size;
        return size;
    }

    public name():
        | string
        | null {
        const value: string = this.value();
        return value
            ?.split("/")
            ?.pop()
            ?.split(".")
            ?.at(-2) || null;
    }

    public extension():
        | string
        | null {
        const value: string = this.value();
        const shards: string[] = value
            ?.split("/")
            ?.pop()
            ?.split(".") ?? [];
        const shardsLength: number = shards.length;
        const isLessThanTwo: boolean = shardsLength < 2;
        if (isLessThanTwo) return null;
        const extension: 
            | string
            | null = shards.at(-1) ?? null;
        return extension;
    }

    public directory():
        | Folder
        | null {
        const value: string = this.value();
        const isFile: boolean = this.isFile();
        const isFolder: boolean = this.isFolder();
        if (isFile) {
            let result: string = "";
            const shards: string[] = value?.split("/");
            shards?.pop();
            shards.forEach(shard => result += (shard + "/"));
            const resultIsEmptyString: boolean = result === "";
            if (!resultIsEmptyString) {
                const resultPathLike: PathLike = new PathLike(result);
                const resultPath: Path = new Path(resultPathLike);
                const resultFolder: Folder = new Folder(resultPath);
                return resultFolder;
            }
            return null;
        }
        else if (isFolder) {
            const valuePathLike: PathLike = new PathLike(value);
            const valuePath: Path = new Path(valuePathLike);
            const valueFolder: Folder = new Folder(valuePath);
            return valueFolder;
        }
        return null;
    }

    public toFolder(): Folder {
        const pathClone: Path = structuredClone(this);
        const folder: Folder = new Folder(pathClone);
        return folder;
    }

    public toFile(): File {
        const pathClone: Path = structuredClone(this);
        const file: File = new File(pathClone);
        return file;
    }

    public join(pathLike: PathLike): this {
        const value: string = this.value();
        const pathLikeString: string = pathLike.toString();
        this._value = joinPath(value, pathLikeString);
        return this;
    }
}

export class File {
    private _path: Path;

    public constructor(path: Path) {
        const isFile: boolean = path.isFile();
        const isNotFileFileErrorMessage: string = "File: path does not reference a file";
        if (!isFile) throw new Error(isNotFileFileErrorMessage);
        this._path = path;
    }

    public name(): string | null {
        const name: 
            | string
            | null = this._path.name();
        return name;
    }

    public path(): Path {
        return this._path;
    }

    public size(): number {
        return this._path.size();
    }

    public extension():
        | string
        | null {
        return this._path.extension();
    }

    public directory():
        | Folder
        | null {
        return this._path.directory();
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
        const value: string = this.path().value();
        const content: string = readFileSync(value, encoding);
        return content;
    }

    public delete(): this {
        const filePathString: string = this.path().value();
        unlinkSync(filePathString);
        return this;
    }

    protected _onlyValidExtensions(extensions: string[]): this {
        let hasAtLeastOneValidExtension: boolean = false;
        extensions.forEach(extension => {
            if (this.extension() === extension) {
                hasAtLeastOneValidExtension = true;
            }
        });
        if (!hasAtLeastOneValidExtension) {
            throw new Error("INVALID_EXTENSION");
        }
        return this;
    }
}

class Folder {
    private _path: Path;

    public constructor(path: Path) {
        const pathIsFolder: boolean = path.isFolder();
        if (pathIsFolder) throw new Error("Folder: path does not reference a folder or directory");
        this._path = path;
    }

    public path(): Path {
        return this._path;
    }

    public childFiles(): File[] {
        const dirPath: string = this.path().value();
        const innerPaths: string[] = readdirSync(dirPath);
        const children: File[] = [];
        innerPaths.forEach(innerPath => {
            const dirPathLike: PathLike = new PathLike(dirPath);
            const childPathLike: PathLike = new PathLike(innerPath);
            const childPath: Path = new Path(dirPathLike).join(childPathLike);
            if (childPath.isFile()) {
                const childFile: File = new File(childPath);
                children.push(childFile);
            }
        });
        return children;
    }

    public childFolders(): Folder[] {
        const rootFolderPath: string = this.path().value();
        const pathsString: string[] = readdirSync(rootFolderPath);
        const folders: Folder[] = [];
        pathsString.forEach(pathString => {
            const rootFolderPathLike: PathLike = new PathLike(rootFolderPath);
            const childPathLike: PathLike = new PathLike(pathString);
            const childPath: Path = new Path(rootFolderPathLike).join(childPathLike);
            if (childPath.isFolder()) {
                const childFolder: Folder = new Folder(childPath);
                folders.push(childFolder);
            }
        });
        return folders;
    }

    public content(): (File | Folder)[] {
        const files: File[] = this.childFiles();
        const folders: Folder[] = this.childFolders();
        return [
            ...files,
            ...folders
        ];
    }

    public lookFor(path: Path):
        | Folder
        | File 
        | null {
        const targetValue: string = path.value();
        const thisPathValue: string = this.path().value();
        if (thisPathValue === targetValue) return this;
        const directChildren: (File | Folder)[] = this.content();
        for (const child of directChildren) {
            const childPathValue: string = child.path().value();
            if (child instanceof File && childPathValue === targetValue) return child;
            else if (child instanceof Folder) {
                const foundInChild:
                    | Folder
                    | File
                    | null = child.lookFor(path);
                if (foundInChild) return foundInChild;
            }
        }
        return null;
    }

    public lookForFile(name: string, extension: string):
        | File
        | null {
        const directChildren: (File | Folder)[] = this.content();
        for (const directChild of directChildren) {
            const directChildIsFile: boolean = directChild instanceof File;
            const directChildIsFolder: boolean = directChild instanceof Folder;
            if (directChildIsFile) {
                const directChildAsFile: File = directChild as File;
                const directChildName:
                    | string
                    | null = directChildAsFile.name();
                const directChildExtension:
                    | string
                    | null = directChildAsFile.extension();
                const isMatch: boolean =
                    directChildName === name &&
                    directChildExtension === extension;
                if (isMatch) return directChildAsFile;
            }
            else if (directChildIsFolder) {
                const directChildAsFolder: Folder = directChild as Folder;
                const folderFound:
                    | File
                    | null = directChildAsFolder.lookForFile(name, extension);
                if (folderFound) return folderFound;
            }
        }
        return null;
    }
}

export class HtmlFile extends File {
    public constructor(path: Path) {
        super(path);
        this._onlyValidExtensions(["html"]);
    }
}

export class JsonFile extends File {
    public constructor(path: Path) {
        super(path);
        this._onlyValidExtensions(["json"]);
    }

    public load(): unknown {
        const content: string = this.content("utf8");
        const parsedContent: string = JSON.parse(content);
        return parsedContent;
    }

    public save(item: object): this {
        const path: string = this.path().value();
        const packedItem: string = JSON.stringify(item);
        writeFileSync(path, packedItem);
        return this;
    }
}

class SolidityCompilationError {
    private _message: string = "";

    public constructor(message: string) {
        this._message = message;
    }

    public message(): string {
        return this._message;
    }

    public log(): this {
        console.log(this.message());
        return this;
    }
}

class SolWarningMessage {
    private _message: string = "";

    public constructor(message: string) {
        this._message = message;
    }

    public message(): string {
        return this._message;
    }

    public log(): this {
        console.log(this.message());
        return this;
    }
}

export class SolidityFile extends File {
    public constructor(path: Path) {
        super(path);
        this._onlyValidExtensions(["sol"]);
    }

    public override name(): string {
        const name:
            | string
            | null = super.name();
        if (!name) {
            throw new Error("SolidityFile: missing name");
        }
        return name;
    }

    public flattenedSolPath(): Path {
        return new Path(new PathLike(`${__dirname}/${this.name()}.${this.extension()}`));
    }

    public override content(): string {
        const pathString: string = this.path().value();
        const flattenedSolPathString: string = this.flattenedSolPath().value();
        const command: string = `bun hardhat flatten ${pathString} > ${flattenedSolPathString}`;
        exec(command);
        const flattenedSolPathLike: PathLike = new PathLike(flattenedSolPathString);
        const flattenedSolPath: Path = new Path(flattenedSolPathLike);
        const flattenedSolFile: File = new File(flattenedSolPath);
        const content: string = flattenedSolFile.content("utf8");
        flattenedSolFile.delete();
        return content;
    }

    public errors(): SolidityCompilationError[] {
        try {
            const errors: SolidityCompilationError[] = [];
            const output: any = this._output();
            const outputErrors: any[] = output.errors;
            outputErrors.forEach(error => {
                const isSevere: boolean = error.severity === "error";
                if (isSevere) {
                    const formattedMessage: string = error.formattedMessage;
                    errors.push(new SolidityCompilationError(formattedMessage));
                }
            });
            return errors;
        }
        catch {
            return [];
        }
    }

    public warnings(): SolWarningMessage[] {
        try {
            const warnings: SolWarningMessage[] = [];
            const output: any = this._output();
            const outputErrors: any[] = output.errors;
            outputErrors.forEach(error => {
                const isSevere: boolean = error.severity === "error";
                if (!isSevere) {
                    const warning: any = error;
                    const formattedMessage: string = warning.formattedMessage;
                    warnings.push(new SolWarningMessage(formattedMessage));
                }
            });
            return warnings;
        }
        catch {
            return [];
        }
    }

    public bytecode(): string {
        try {
            const name: string = this.name();
            const output: any = this._output;
            const errors: string[] = this.errors();
            const errorsLength: number = errors.length;
            const hasErrors: boolean = errorsLength !== 0;
            if (hasErrors) return "";
            const bytecode: string = output
                ?.contracts
                ?.[name]
                ?.[name]
                ?.evm
                ?.bytecode
                ?.object ?? "";
            return bytecode;
        }
        catch {
            return "";
        }
    }

    public abi(): object[] {
        try {
            if (this.errors().length !== 0) {

            }

            const name: string = this.name();
            const output: any = this._output();
            const errors: string[] = this.errors();
            const errorsLength: number = errors.length;
            const hasErrors: boolean = errorsLength !== 0;
            if (hasErrors) return [];
            const abi: object[] = output
                ?.contracts
                ?.[name]
                ?.[name]
                ?.abi ?? [];
            return abi;
        }
        catch {
            return [];
        }
    }

    public methods(): 
        | object 
        | null {
        try {
            if (this.errors().length !== 0) {
                return null;
            }
            return this._output() 
                ?.contracts
                ?.[this.name()]
                ?.[this.name()]
                ?.evm
                ?.methodIdentifiers ?? null;
        }
        catch {
            return null;
        }
    }

    private _output(): any {
        return JSON.parse(solc.compile(JSON.stringify({
            language: "Solidity",
            sources: {[this.name()]: {
                content: this.content()
            }}, 
            settings: {outputSelection: {"*": {"*": [
                "abi",
                "evm.bytecode",
                "evm.methodIdentifiers"
            ]}}}
        })));
    }
}