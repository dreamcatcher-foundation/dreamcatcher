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
import memoize from "memoize";

interface IServer {
    connected(): boolean;
    bindRoot(path: IPath): IServer;
    expose(url: IUrl, handler: (request: Express.Request, response: Express.Response) => void): IServer;
    exposeReactApp(url: IUrl, directory: IDirectory): TsResult.Result<IServer, unknown>;
    boot(port: bigint): TsResult.Result<IServer, unknown>;
    shutdown(): TsResult.Result<IServer, unknown>;
}

export const server = (function() {
    let _express: Express.Express = Express();
    let _app: unknown;
    let _: IServer;

    function connected(): (boolean) {
        return !_app ? false : true;
    }

    function bindRoot(path: IPath): typeof _ {
        _express.use(Express.static(path.toString()));
        return _;
    }

    function expose(url: IUrl, handler: (request: Express.Request, response: Express.Response) => void): typeof _ {
        _express.get(url.toString(), handler);
        return _;
    }

    function exposeReactApp(url: IUrl, directory: IDirectory): TsResult.Result<typeof _, unknown> {
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
                return TsResult.Some<ITsxFile>(TsxFile(path).unwrap());
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
                return TsResult.Some<IHtmlFile>(HtmlFile(path).unwrap());
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
        const buffer: TsResult.Result<Buffer, unknown> = tsx.unwrap().transpile();
        if (buffer.err) {
            return buffer;
        }
        console.log(buffer.unwrap().toString("utf8"));
        bindRoot(directory.path());
        expose(
            url,
            (request, response) => response
                .status(200)
                .sendFile(html.unwrap().path().toString())
        );
        return TsResult.Ok<typeof _>(_);
    }

    function boot(port: bigint = 3000n): TsResult.Result<typeof _, unknown> {
        try {
            return (
                connected()
                    ? _shutdown().andThen(() => _boot(port))
                    : _boot(port)
            );
        }
        catch (error: unknown) {
            return TsResult.Err<unknown>(error);
        }     
    }

    function shutdown(): TsResult.Result<typeof _, unknown> {
        return _shutdown();
    }

    function _boot(port: bigint = 3000n): TsResult.Result<typeof _, unknown> {
        try {
            _app = _express.listen(Number(port));
            return TsResult.Ok<typeof _>(_);
        }
        catch (error: unknown) {
            return TsResult.Err<unknown>(error);
        }
    }

    function _shutdown(): TsResult.Result<typeof _, unknown> {
        try {
            /** @unsafe */
            (_app as any).close();
            return TsResult.Ok<typeof _>(_);
        }
        catch (error: unknown) {
            return TsResult.Err<unknown>(error);
        }
    }

    return function() {
        if (!_) return _ = { 
            connected, 
            bindRoot, 
            expose, 
            exposeReactApp,
            boot,
            shutdown
        };
        return _;
    }
})();