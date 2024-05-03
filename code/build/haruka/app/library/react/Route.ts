import TypescriptPath from "../os/path/TypescriptPath.ts";
import HyperTextMarkupLanguagePath from "../os/path/HyperTextMarkupLanguagePath.ts";
import Url from "../web/Url.ts";

export default class Route {
    public constructor(
        private readonly _typescriptPath: TypescriptPath,
        private readonly _hyperTextMarkupLanguagePath: HyperTextMarkupLanguagePath,
        private readonly _urlish: string | Url
    ) {
        const directory0: string | undefined = this
            ._typescriptPath
            .directoryPath()
            ?.get();
        const directory1: string | undefined = this
            ._hyperTextMarkupLanguagePath
            .directoryPath()
            ?.get();
        if (!directory0 || !directory1) {
            throw new Error("Route: missing directory");
        }
        /**
         * NOTE Will transpile into javascript and place the file
         *      in the same directory as the typescript file.
         */
        this._typescriptPath.transpile();
        this._hyperTextMarkupLanguagePath.expose(this._urlish);
    }
}