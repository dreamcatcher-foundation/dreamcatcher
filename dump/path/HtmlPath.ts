import {Path, PathLike, IncompatibleExtension} from "../Path.ts";

export class HtmlPath extends Path {
    public constructor(_value: PathLike) {
        super(_value);
        if (this.extension() != "html") {
            throw new IncompatibleExtension();
        }
    }
}

export {PathLike};