import Path from "./Path.ts";
import {execSync} from "child_process";

export default class TypescriptPath extends Path {
    public constructor(pathish: string | Path) {
        super(pathish);
        this._onlyExtensions(["ts", "tsx"]);
    }

    public transpile(outDirPathish?: string | Path): this {
        const path: string = Path.toString(outDirPathish ?? "");
        let command: string = "";
        if (!path) {
            if (!this.directoryPath()) {
                throw new Error("TypescriptPath: Requires a directory path but was unable to get one.");
            }
            command = `bun build ${this.get()} --outdir ${this.directoryPath()!.get()}`;
        }
        else {
            command = `bun build ${this.get()} --outdir ${path}`;
        }
        execSync(command);
        return this;
    }
}