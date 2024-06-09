import { type IPath } from "./IPath.ts";
import { type IUrl } from "../web/IUrl.ts";
import { type IDirectory } from "./IDirectory.ts";
import { type ITsxFile } from "./file/ITsxFile.ts";
import { type IHtmlFile } from "./file/IHtmlFile.ts";
import { TsxFile } from "./file/TsxFile.ts";
import { HtmlFile } from "./file/HtmlFile.ts";
import { File } from "./file/File.ts";
import * as TsResult from "ts-results";
import Express from "express";

interface IServer {
    connected(): boolean;
    bindRoot({ path }: { path: IPath; }): IServer;
    expose({ url, handler }: { url: IUrl; handler(request: Express.Request, response: Express.Response): void; }): void;

}

export const server = (function() {
    let _express: Express.Express = Express();
    let _app: unknown;
    let _: IServer;

    function connected(): (boolean) {
        return !_app ? false : true;
    }

    function bindRoot({ path }: { path: IPath }): typeof _ {
        _express.use(Express.static(path.toString()));
        return _;
    }

    function expose({
        url,
        handler}: {
            url: IUrl;
            handler(
                request: Express.Request,
                response: Express.Response
            ): void;
    }): typeof _ {
        _express.get(url.toString(), handler);
        return _;
    }

    function exposeReactApp({
        directory,
        url}: {
            directory: IDirectory,
            url: IUrl
    }): TsResult.Result<typeof _, unknown> {
        const tsx: TsResult.Option<ITsxFile> = (function(): TsResult.Option<ITsxFile> {
            try {
                let path: TsResult.Option<IPath> = TsResult.None;
                directory.childFiles().unwrapOr([]).forEach(childFile => {
                    if (childFile.name().unwrapOr(undefined) === "App") {
                        if (childFile.extension().unwrapOr(undefined) === "tsx") {
                            path = TsResult.Some<IPath>(childFile.path());
                        }
                    }
                    path = TsResult.None;
                });
                if (path.none) {
                    return TsResult.None;
                }
                return TsResult.Some<ITsxFile>(TsxFile({ _path: path }).unwrap());
            }
            catch {
                return TsResult.None;
            }
        })();
        const html: TsResult.Option<IHtmlFile> = (function(): TsResult.Option<IHtmlFile> {
            try {
                let path: TsResult.Option<IPath> = TsResult.None;
                directory.childFiles().unwrapOr([]).forEach(childFile => {
                    if (childFile.name().unwrapOr(undefined) === "App") {
                        if (childFile.extension().unwrapOr(undefined) === "html") {
                            path = TsResult.Some<IPath>(childFile.path());
                        }
                    }
                    path = TsResult.None;
                });
                if (path.none) {
                    return TsResult.None;
                }
                return TsResult.Some<IHtmlFile>(HtmlFile({ _path: path }).unwrap());
            }
            catch {
                return TsResult.None;
            }
        })();
        if (tsx.none) {
            return TsResult.Err<string>("MissingTsxAppFile");
        }
        if (html.none) {
            return TsResult.Err<string>("MissingHtmlAppFile");
        }
        const buffer: TsResult.Result<Buffer, unknown> = tsx.unwrap().transpile({});
        if (buffer.err) {
            return buffer;
        }
        console.log(buffer.unwrap().toString("utf8"));
        bindRoot({ path: directory.path() });
        expose({ url, handler(request, response) {
            response
                .status(200)
                .sendFile(html.unwrap().path().toString());
            return;
        } });
        return TsResult.Ok<typeof _>(_);
    }

    return function() {
        if (!_) return _ = { connected, bindRoot, expose, exposeReactApp };
        return _;
    }
})();