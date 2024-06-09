import Path from "./Path.ts";
import Url from "../../web/url/Url.ts";

export default class HtmlPath extends Path {
    public expose(url: Url): this {
        url.exposePath(this);
        return this;
    }
}