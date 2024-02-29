import {
    readFileSync,
    existsSync,
    readdirSync,
    statSync,
    type Stats
} from "fs";
import {
    resolve,
    join,
    extname
} from "path";
import {type SourceUnit} from "solidity-ast";
import {findAll} from "solidity-ast/utils";

class Fault extends Error {
    public constructor(public readonly message: string, public readonly data?: any[]) {
        super(message);
        Object.setPrototypeOf(this, Fault.prototype);
    }
}

class Path {
    public constructor(private readonly _value: string) {
        if (this._value === '') {
            throw new Fault('Path: path cannot be an empty string');
        }
    }

    public value(): string {
        return this._value;
    }

    public ending(): string {
        const ending: string | undefined = this.value().split('/').at(-1);
        if (!ending) {
            throw new Fault('Path: unable to strip ending from path', [this, this.value()]);
        }
        return ending;
    }

    public type(): 'File' | 'Dir' {
        const type: 'File' | 'Dir' | undefined =  statSync(this.value()).isFile() 
        ? 'File'
        : statSync(this.value()).isDirectory()
            ? 'Dir'
            : undefined
        if (!type) {
            throw new Fault('Path: unknown instanceof path', [this]);
        }
        return type;
    }

    public toType(): File | Dir {
        switch (this.type()) {
            case "File":
                return new File(this);
            case "Dir":
                return new Dir(this);
            default:
                throw new Fault('Path: failed conversation to type', [this]);
        }
    }
}

class File {
    public constructor(private readonly _path: Path) {}

    public path(): Path {
        return this._path;
    }

    public name(): string {
        const name: string | undefined = this.path().ending().split('.').at(-2);
        if (!name) {
            throw new Error(`File +> unable to strip name from path +> ${this.path()}`);
        }
        return name;
    }

    public extension(): string {
        const extension: string | undefined = this.path().ending().split('.').at(-1);
        if (!extension) {
            throw new Error(`File +> unable to strip extension from path +> ${this.path()}`);
        }
        return extension;
    }

    public content(
        encoding: 'ascii'
                | 'base64'
                | 'base64url'
                | 'binary'
                | 'hex'
                | 'latin1'
                | 'ucs-2'
                | 'ucs2'
                | 'utf-8'
                | 'utf8'
                | 'utf16le'
    ): string {
        return readFileSync(this.path().value(), encoding);
    }
}

class Dir {
    public constructor(private readonly _path: Path) {}

    public path(): Path {
        return this._path;
    }

    public paths(): Path[] {
        const paths: (Path | string)[] = [];
        paths.push(...readdirSync(this.path().value()));
        for (let i = 0; i < paths.length; i++) {
            const path: Path = new Path(this.path().value() + '/' + paths[i]);
            paths[i] = path;
        }
        return paths as Path[];
    }

    public pathsWithin(): Path[] {
        const paths: Path[] = [];
        const queue: Dir[] = [this];
        while (queue.length > 0) {
            const currentDir: Dir = queue.shift()!;
            const dirPaths: Path[] = currentDir.paths();
            for (const path of dirPaths) {
                if (path.type() === 'Dir') {
                    queue.push(path.toType() as Dir);
                } else if (path instanceof Path) {
                    paths.push(path);
                } else {
                    throw new Fault('Dir: path must either be a dir to be added to the queue or a path but no match was found');
                }
            }
        }
        return paths;
    }

    public contents(): (File | Dir)[] {
        const contents: (File | Dir | Path)[] = [...this.paths()];
        for (let i = 0; i < contents.length; i++) {
            contents[i] = (contents[i] as Path).toType();
        }
        return contents as (File | Dir)[];
    }

    public contentsWithin(): File[] {
        const contents: (File | Dir | Path)[] = [...this.pathsWithin()];
        for (let i = 0; i < contents.length; i++) {
            contents[i] = (contents[i] as Path).toType();
        }
        return contents as File[];
    }

    public searchByName(name: string): File[] {
        return this.search(function(file: File) {
            return file.name() === name;
        });
    }

    public searchByExtension(extension: string): File[] {
        return this.search(function(file: File) {
            return file.extension() === extension;
        });
    }

    public searchByNameAndExtension(name: string, extension: string): File[] {
        return this.search(function(file: File) {
            return file.name() === name && file.extension() === extension;
        });
    }

    public search(isSelected: (file: File) => boolean): File[] {
        const files: File[] = this.contentsWithin();
        const found: File[] = [];
        for (let i = 0; i < files.length; i++) {
            const file: File = files[i]
            try {
                if (isSelected(file)) {
                    found.push(file);
                }
            }
            catch (error: unknown) {
                //console.warn(new Fault('Dir: failed to read a file during search likely due to anomalous path structure', [this, file, error]));
            }
        }
        return found;
    }
}

class SolFile {
    public constructor(private readonly _file: File) {
        if (this.file().extension() !== 'sol') {
            throw new Error('SolFile: file extension must be sol');
        }
    }
    
    public file(): File {
        return this._file;
    }

    public license(): string {
        const content: string = this.file().content("utf8");
        const regexLicense = /\/\/\s+SPDX-License-Identifier:\s+(.+)\s*$/m;
        const matchLicense = content.match(regexLicense);
        if (!matchLicense) {
            throw new Error("SolFile: unable to match license");
        }
        return matchLicense[1];
    }

    public relativeImports(): (string | undefined)[] {
        const content: string = this.file().content('utf8');
        const regex: RegExp = /import\s+["']([^"']+)["']/g;
        const matches: RegExpMatchArray | null = content.match(regex);
        const matched: (string | undefined)[] = [];
        for (let i = 0; i < matches?.length!; i++) {
            const regexPath: RegExp = /import\s+["'']([^"'']+)["'']/;
            const matchesPath = matches?.at(1)!.match(regexPath);
            matched.push(matchesPath?.at(1));
        }
        return matched;
    }

    public imports() {

    }

    public pragma(): string {
        const content: string = this.file().content("utf8");
        const regexPragma = /pragma\s+solidity\s+([^\s;]+)/;
        const matchPragma = content.match(regexPragma);
        if (!matchPragma) {
            throw new Error("SolFile: unable to match pragma");
        }
        return matchPragma[1];
    }
}

const dir = new Dir(new Path('code'))

const sol = new SolFile(dir.searchByName('Oracle')[0])
console.log(sol.pragma(), sol.license());