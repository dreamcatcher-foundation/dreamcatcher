import Route from "./Route.ts";
import Url from "../web/Url.ts";
import Path from "../os/path/Path.ts";
import TypescriptPath from "../os/path/TypescriptPath.ts";
import HyperTextMarkupLanguagePath from "../os/path/HyperTextMarkupLanguagePath.ts";

/**
 * NOTE Both files must be present, and must be named Index.html
 *      and Index.tsx for the route to be generated. An Index.js
 *      file will be placed in the foler.
 */
export default class FolderRoute {
    public constructor(
        private _folderPathish: string | Path,
        private _urlish: string | Url
    ) {
        new Route(
            new TypescriptPath(new Path(Path.toString(this._folderPathish)).join("Index.tsx")),
            new HyperTextMarkupLanguagePath(new Path(Path.toString(this._folderPathish)).join("Index.html")),
            new Url(Url.toString(this._urlish))
        );
    }
}