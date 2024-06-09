import type { IPath } from "@HarukaToolkitBundle";
import type { ITsxFile } from "@HarukaToolkitBundle";
import type { IHtmlFile } from "@HarukaToolkitBundle";
import type { IDirectory } from "@HarukaToolkitBundle";
import type { Express } from "@HarukaToolkitBundle";
import type { Request } from "@HarukaToolkitBundle";
import type { Response } from "@HarukaToolkitBundle";
import { TsxFile } from "@HarukaToolkitBundle";
import { HtmlFile } from "@HarukaToolkitBundle";
import { Result } from "@HarukaToolkitBundle";
import { Option } from "@HarukaToolkitBundle";
import { Some } from "@HarukaToolkitBundle";
import { None } from "@HarukaToolkitBundle";
import { Err } from "@HarukaToolkitBundle";
import { Ok } from "@HarukaToolkitBundle";
import { Url } from "@HarukaToolkitBundle";
import express from "express";

interface IHost {
    connected(): boolean;
    useRoot({path}: {path: IPath}): void;
    expose({url, hook}: {url: Url; hook(request: Request, response: Response): void;}): void;
    exposeReactApp({directory, url}: {directory: IDirectory; url: Url;}): Result<boolean, unknown>;
    boot(port: bigint): Result<boolean, unknown>;
    shutdown(): Result<boolean, unknown>;
}

const host: () => IHost = (function(): () => IHost {
    let self: IHost;
    let _express: Express = express();
    let _app: unknown;

    function connected(): boolean {
        return !!_app;
    }

    function useRoot({path}: {path: IPath}): void {
        _express.use(express.static(path.toString()));
        return;
    }

    function expose({url, hook}: {url: Url; hook(request: Request, response: Response): void;}): void {
        _express.get(url.toString(), hook);
        return;
    }

    function exposeReactApp({directory, url}: {directory: IDirectory; url: Url;}): Result<boolean, unknown> {
        let TSXFilePathOption: Option<IPath> = None;
        let HTMLFilePathOption: Option<IPath> = None;
        directory.files().unwrapOr([]).forEach(file => {
            if (
                file.name().unwrapOr(undefined) === "App" &&
                file.extension().unwrapOr(undefined) === "tsx"
            ) {
                TSXFilePathOption = Some<IPath>(file.path());
            }
            if (
                file.name().unwrapOr(undefined) === "App" &&
                file.extension().unwrapOr(undefined) === "html"
            ) {
                HTMLFilePathOption = Some<IPath>(file.path());
            }
        });
        if (TSXFilePathOption.none) {
            return Err("Host: Missing tsx file.");
        }
        if (HTMLFilePathOption.none) {
            return Err("Host: Missing html file.");
        }
        let TSXFile_: Result<ITsxFile, unknown> = TsxFile({path: (TSXFilePathOption as Option<IPath>).unwrap()});
        let HTMLFile_: Result<IHtmlFile, unknown> = HtmlFile({path: (HTMLFilePathOption as Option<IPath>).unwrap()});
        if (TSXFile_.err) {
            return TSXFile_;
        }
        if (HTMLFile_.err) {
            return HTMLFile_;
        }
        let transpileResult: Result<Buffer, unknown> = TSXFile_.unwrap().transpile({});
        if (transpileResult.err) {
            return transpileResult;
        }
        let buffer: Buffer = transpileResult.unwrap();
        console.log(buffer.toString("utf8"));
        useRoot({path: directory.path()});
        expose({
            url: url,
            hook(request, response) {
                response
                    .status(200)
                    .sendFile(HTMLFile_.unwrap().path().toString());
                return;
            },
        });
        return Ok<boolean>(true);
    }

    function boot(port:bigint=3000n): Result<boolean, unknown> {
        if (!connected()) {
            let bootResult:Result<boolean,unknown> = _boot(port);
            if (bootResult.err) {
                return bootResult;
            }
            return Ok<boolean>(true);
        }
        let shutdownResult: Result<boolean, unknown> = _shutdown();
        if (shutdownResult.err) {
            return shutdownResult;
        }
        let bootResult: Result<boolean, unknown> = _boot(port);
        if (bootResult.err) {
            return bootResult;
        }
        return Ok<boolean>(true);
    }

    function shutdown(): Result<boolean, unknown> {
        return _shutdown();
    }

    function _boot(port:bigint=3000n): Result<boolean, unknown> {
        try {
            _app = _express.listen(Number(port));
            return Ok<boolean>(true);
        }
        catch (error: unknown) {
            return Err<unknown>(error);
        }
    }

    function _shutdown(): Result<boolean, unknown> {
        try {
            (_app as any).close();
            return Ok<boolean>(true);
        }
        catch (error: unknown) {
            return Err<unknown>(error);
        }
    }

    return function() {
        if (!self) {
            return self = {
                connected,
                useRoot,
                expose,
                exposeReactApp,
                boot,
                shutdown
            };
        }
        return self;
    }
})();

export type { IHost };
export { host };