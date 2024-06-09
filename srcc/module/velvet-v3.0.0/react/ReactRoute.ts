import TsxPath from "../os/path/TsxPath.ts";
import HtmlPath from "../os/path/HtmlPath.ts";
import Path from "../os/path/Path.ts";
import Url from "../web/url/Url.ts";

export default class ReactRoute {
    public constructor(
        private readonly _tsxPath: TsxPath,
        private readonly _htmlPath: HtmlPath,
        private readonly _url: Url) {
        const path: Path | null = this._tsxPath.dir();
        const dir0: string | undefined = this._tsxPath.dir()?.value();
        const dir1: string | undefined = this._htmlPath.dir()?.value();
        const isNotInSameDir: boolean = dir0 != dir1;
        const hasNoDir: boolean = dir0 == null || dir1 == null;
        if (isNotInSameDir) {
            throw new Error("ReactRoute: tsx and html files must be held in the same directory");
        }
        if (hasNoDir) {
            throw new Error("ReactRoute: cannot find dirname");
        }
        this._tsxPath.transpile(path!);
        this._htmlPath.expose(this._url);
    }
}