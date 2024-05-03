import Path from "./Path.ts";
import {writeFileSync} from "fs";

export default class JavaScriptObjectNotationPath extends Path {
    public constructor(pathish: string | Path) {
        super(pathish);
        this._onlyExtensions(["json"]);
    }

    public load(): unknown {
        return JSON.parse(this.content("utf8"));
    }

    public save(object: object): this {
        writeFileSync(this.get(), JSON.stringify(object));
        return this;
    }
}