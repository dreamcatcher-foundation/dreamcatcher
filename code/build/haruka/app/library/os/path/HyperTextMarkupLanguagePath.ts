import Path from "./Path.ts";
import Url from "../../web/Url.ts";

export default class HyperTextMarkupLanguagePath extends Path {
    public constructor(pathish: string | Path) {
        super(pathish);
        this._onlyExtensions(["html"]);
    }

    public expose(urlish: string | Url): this {
        new Url(urlish).exposePath(this.get());
        return this;
    }
}