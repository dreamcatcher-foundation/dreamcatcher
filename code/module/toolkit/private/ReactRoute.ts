import {TypescriptPath} from "./Lib__Path.ts";
import {HyperTextMarkupLanguagePath} from "./Lib__Path.ts";
import {Url} from "./Url.ts";

class ReactRoute {
    public constructor(
        private readonly _typescriptPath: TypescriptPath,
        private readonly _hyperTextMarkupLanguagePath: HyperTextMarkupLanguagePath,
        private readonly _url: Url) {
        const dir: (string | undefined)[] = [
            this._typescriptPath.dir()?.get(),
            this._hyperTextMarkupLanguagePath.dir()?.get()
        ];
        if (dir[0] != dir[1]) {
            throw new Error(`ReactRoute: Requires the typescript and html file to be located within the same directory but they are located at ${dir[0]} and ${dir[1]}`);
        }
        if (dir[0] == null || dir[1] == null) {
            throw new Error("ReactRoute: Requires both dir paths but failed to get them.");
        }
        this._typescriptPath.transpile();
        this._hyperTextMarkupLanguagePath.expose(this._url.get());
    }
}

export {ReactRoute};