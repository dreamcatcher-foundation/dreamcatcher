import {execSync} from "child_process";
import Path from "./Path.ts";

export default class TsxPath extends Path {
    public transpile(outdir?: Path): this {
        const command: string = `bun build ${this._value} --outdir ${outdir?.value() ?? __dirname}`;
        execSync(command);
        return this;
    }
}