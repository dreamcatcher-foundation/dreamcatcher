import { type Express } from "express";
import { type Request } from "express";
import { type Response } from "express";
import { type SpawnSyncReturns } from "child_process";
import { Path } from "@atlas/shared/os/Path.ts";
import { TsxFile } from "@atlas/shared/os/TsxFile.ts";
import { HtmlFile } from "@atlas/shared/os/HtmlFile.ts";
import { Directory } from "@atlas/shared/os/Directory.ts";
import { Result } from "ts-results";
import { Option } from "ts-results";
import { Some } from "ts-results";
import { None } from "ts-results";
import { Ok } from "ts-results";
import { Err } from "ts-results";
import { Url } from "@atlas/shared/web/Url.ts";
import express from "express";

class Host {
    private constructor() {}
    private static _express: Express = express();
    private static _app: unknown;

    public static connected(): boolean {
        return !!this._app;
    }

    public static useRoot(path: Path): typeof Host {
        this._express.use(express.static(path.toString()));
        return this;
    }

    public static expose(url: Url, hook: (request: Request, response: Response) => void): typeof Host {
        this._express.get(url.toString(), hook);
        return this;
    }

    public static exposeReactApp(directory: Directory, url: Url): Result<boolean, unknown> {
        let tsxFilePathOption: Option<Path> = None;
        let htmlFilePathOption: Option<Path> = None;
        directory.files().unwrapOr([]).forEach(file => {
            if (file.name().unwrapOr(undefined) === "App" && file.extension().unwrapOr(undefined) === "tsx") {
                tsxFilePathOption = new Some<Path>(file.path());
            }
            if (file.name().unwrapOr(undefined) === "App" && file.extension().unwrapOr(undefined) == "html") {
                htmlFilePathOption = new Some<Path>(file.path());
            }
        });
        if (tsxFilePathOption.none) {
            return new Err<string>("Host: Could not find App.tsx file.");
        }
        if (htmlFilePathOption.none) {
            return new Err<string>("Host: Could not find App.html file.");
        }
        let tsxFile: TsxFile = new TsxFile((tsxFilePathOption as Option<Path>).unwrap());
        let htmlFile: HtmlFile = new HtmlFile((htmlFilePathOption as Option<Path>).unwrap());
        if (tsxFile.isBroken()) {
            return new Err<string>("Host: App.tsx file is broken.");
        }
        if (htmlFile.isBroken()) {
            return new Err<string>("Host: App.html file is broken.");
        }
        let transpileResult: Result<Buffer, unknown> = tsxFile.transpile();
        if (transpileResult.err) {
            return transpileResult;
        }
        let output: Buffer = transpileResult.unwrap();
        console.log(output.toString("utf8"));
        this.useRoot(directory.path());
        this.expose(url, (request, response) => {
            response
                .status(200)
                .sendFile(htmlFile.path().toString());
            return;
        });
        return new Ok<boolean>(true);
    }

    public static boot(port: bigint = 3000n): Result<boolean, unknown> {
        if (!this.connected()) {
            let bootResult: Result<boolean, unknown> = this._boot(port);
            if (bootResult.err) {
                return bootResult;
            }
            return new Ok<boolean>(true);
        }
        let shutdownResult: Result<boolean, unknown> = this._shutdown();
        if (shutdownResult.err) {
            return shutdownResult;
        }
        let bootResult: Result<boolean, unknown> = this._boot(port);
        if (bootResult.err) {
            return bootResult;
        }
        return new Ok<boolean>(true);
    }

    public static shutdown(): Result<boolean, unknown> {
        return this._shutdown();
    }

    private static _boot(port: bigint = 3000n): Result<boolean, unknown> {
        try {
            this._app = this._express.listen(Number(port));
            return Ok<boolean>(true);
        }
        catch (error: unknown) {
            return new Err<unknown>(error);
        }
    }

    private static _shutdown(): Result<boolean, unknown> {
        try {
            (this._app as any).close();
            return new Ok<boolean>(true);
        }
        catch (error: unknown) {
            return new Err<unknown>(error);
        }
    }
}

export { Host };