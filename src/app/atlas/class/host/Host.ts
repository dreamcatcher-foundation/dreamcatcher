import * as TsResult from "ts-results";
import FileSystem from "fs";
import * as ChildProcess from "child_process";
import { join } from "path";
import Solc from "solc";
import Express from "express";
import { IUrl } from "../web/Url.ts";
import { ethers as Ethers } from "ethers";

export abstract class IBreakable {
    public abstract isBroken(): boolean;
}

export namespace Host {
    export abstract class ISecret {
        public abstract environmentVariableKey(): string;
        public abstract resolve(): TsResult.Option<string>;
    } 

    export abstract class IPath {
        public abstract toString(): string;
        public abstract exists(): TsResult.Result<boolean, unknown>;
        public abstract isFile(): TsResult.Result<boolean, unknown>;
        public abstract isDirectory(): TsResult.Result<boolean, unknown>;
    }

    export abstract class IFile extends IBreakable {
        public abstract path(): IPath;
        public abstract name(): TsResult.Option<string>;
        public abstract extension(): TsResult.Option<string>;
        public abstract directory(): TsResult.Option<IDirectory>;
        public abstract content(): TsResult.Result<Buffer, unknown>;
        public abstract delete(): TsResult.Result<void, unknown>;
        public abstract create(override?: boolean): TsResult.Result<void, unknown>;
    }

    export abstract class IDirectory {
        public abstract path(): IPath;
        public abstract paths(): IPath[];
        public abstract directories(): TsResult.Result<IDirectory[], unknown>;
        public abstract files(): TsResult.Result<IFile[], unknown>;
        public abstract children(): (IFile | IDirectory)[];
        public abstract lookFor(fileName: string, fileExtension: string): TsResult.Option<IFile>;
    }

    export abstract class IHtmlFile extends IFile {}

    export abstract class ISolcCompilationErrorOrWarning {
        public abstract severity: string;
        public abstract formattedMessage: string;
    }

    export abstract class ISolcCompilationOutput {
        public abstract errors: ISolcCompilationErrorOrWarning[];
        public abstract contracts: {[contractName: string]: {[contractName: string]: {
            abi:
                | object[]
                | string[];
            evm: {
                methodIdentifiers: object;
                bytecode: {
                    object: string;
                };
            };
        }}};
    }

    export abstract class ISolFile extends IFile {
        public abstract temporaryPath(): TsResult.Option<IPath>;
        public abstract output(): TsResult.Result<ISolcCompilationOutput, unknown>;
        public abstract errors(): TsResult.Result<string[], unknown>;
        public abstract warnings(): TsResult.Result<string[], unknown>;
        public abstract bytecode(): TsResult.Result<string, unknown>;
        public abstract abi(): TsResult.Result<object[] | string[], unknown>;
        public abstract methods(): TsResult.Result<object, unknown>;
    }

    export abstract class ITsxFile extends IFile {
        public abstract transpile(directory?: IDirectory): TsResult.Result<Buffer, unknown>;
    }

    export abstract class ITransaction {
        public abstract receipt(): Promise<TsResult.Result<Ethers.TransactionReceipt | null, unknown>>;
    }

    export abstract class IConstructorTransactionConstructorPayload {
        public abstract rpcUrl: string;
        public abstract privateKey: string;
        public abstract gasPrice?: 
            | bigint
            | "veryLow"
            | "low"
            | "standard"
            | "fast";
        public abstract gasLimit?: bigint;
        public abstract bytecode: ISolFile;
        public abstract chainId?: bigint;
        public abstract confirmations?: bigint;
    }

    export abstract class ITransactionConstructorPayload {
        public abstract to: string;
        public abstract rpcUrl: string;
        public abstract privateKey: string;
        public abstract gasPrice?: 
            | bigint
            | "veryLow"
            | "low"
            | "standard"
            | "fast";
        public abstract gasLimit?: bigint;
        public abstract methodSignature: string;
        public abstract methodName: string;
        public abstract methodArgs?: unknown[];
        public abstract chainId?: bigint;
        public abstract confirmations?: bigint;
        public abstract value?: bigint;
    }

    export abstract class IQueryConstructorPayload {
        public abstract rpcUrl: string;
        public abstract address: string;
        public abstract methodSignature: string;
        public abstract methodName: string;
        public abstract methodArgs: unknown[];
    }

    export abstract class IQuery {
        public abstract response(): Promise<unknown>;
    }

    export class Secret implements ISecret {
        public constructor(protected _environmentVariableKey: string) {}
    
        public environmentVariableKey(): string {
            return this._environmentVariableKey;
        }
    
        public resolve(): TsResult.Option<string> {
            let content: 
                | string 
                | undefined = process
                    ?.env
                    ?.[this.environmentVariableKey()];
            if (!content) {
                return TsResult.None;
            }
            return new TsResult.Some<string>(content);
        }
    }

    export class Path implements IPath {
        public constructor(protected _inner: string) {}

        public toString(): string {
            return this._inner;
        }

        public exists(): TsResult.Result<boolean, unknown> {
            try {
                return new TsResult.Ok<boolean>(FileSystem.existsSync(this.toString()));
            }
            catch (error: unknown) {
                return new TsResult.Err<unknown>(error);
            }
        }

        public isFile(): TsResult.Result<boolean, unknown> {
            if (!this.exists().unwrapOr(false)) {
                return new TsResult.Err<string>("Host::Path::FileNotFound");
            }
            try {
                return new TsResult.Ok<boolean>(FileSystem.statSync(this.toString()).isFile());
            }
            catch (error: unknown) {
                return new TsResult.Err<unknown>(error);
            }
        }

        public isDirectory(): TsResult.Result<boolean, unknown> {
            if (!this.exists().unwrapOr(false)) {
                return new TsResult.Err<string>("Host::Path::FileNotFound");
            }
            try {
                return new TsResult.Ok<boolean>(FileSystem.statSync(this.toString()).isFile());
            }
            catch (error: unknown) {
                return new TsResult.Err<unknown>(error);
            }
        }
    }

    export class Directory implements IDirectory {
        public constructor(protected _path: IPath) {}

        public path(): IPath {
            return this._path;
        }

        public paths(): IPath[] {
            let result: IPath[] = [];
            FileSystem.readdirSync(this.path().toString()).forEach(path => result.push(new Path(path)));
            return result;
        }

        public directories(): TsResult.Result<IDirectory[], unknown> {
            try {
                let result: IDirectory[] = [];
                this.paths().forEach(path => {
                    if (!path.isDirectory().unwrapOr(false)) {
                        return;
                    }
                    result.push(new Directory(path));
                });
                return new TsResult.Ok<IDirectory[]>(result);
            }
            catch (error: unknown) {
                return new TsResult.Err<unknown>(error);
            }
        }

        public files(): TsResult.Result<IFile[], unknown> {
            try {
                let result: IFile[] = [];
                this.paths().forEach(path => {
                    let joinedPathString: string = join(this.path().toString(), path.toString());
                    let joinedPath: Path = new Path(joinedPathString);
                    if (!joinedPath.isFile().unwrapOr(false)) {
                        return;
                    }
                    result.push(new File(joinedPath));
                });
                return new TsResult.Ok<IFile[]>(result);
            }
            catch (error: unknown) {
                return new TsResult.Err<unknown>(error);
            }
        }

        public children(): (IFile | IDirectory)[] {
            return [...this.directories().unwrapOr([]), ...this.files().unwrapOr([])];
        }

        public lookFor(fileName: string, fileExtension: string): TsResult.Option<IFile> {
            for (let child of this.children()) {
                if (child instanceof File) {
                    if (child.name().unwrapOr(undefined) === fileName && child.extension().unwrapOr(undefined) === fileExtension) {
                        return new TsResult.Some<File>(child);
                    }
                }
                if (child instanceof Directory) {
                    let found: TsResult.Option<IFile> = child.lookFor(fileName, fileExtension);
                    if (found.some) {
                        return found;
                    }
                }
            }
            return TsResult.None;
        }
    }

    export class File implements IFile, IBreakable {
        protected _isBroken: boolean = false;

        public constructor(protected _path: IPath) {
            if (!this.path().isFile().unwrapOr(false)) {
                this._isBroken = true;
            }
        }

        public isBroken(): boolean {
            return this._isBroken;
        }

        public path(): IPath {
            return this._path;
        }
        
        public name(): TsResult.Option<string> {
            let result: string | undefined
                = this.path().toString()
                    ?.split("/")
                    ?.pop()
                    ?.split(".")
                    ?.at(-2);
            if (!result) {
                return TsResult.None;
            }
            return new TsResult.Some<string>(result);
        }

        public extension(): TsResult.Option<string> {
            let shards: string[]
                = this.path().toString()
                    ?.split("/")
                    ?.pop()
                    ?.split(".") ?? [];
            if (shards.length < 2) {
                return TsResult.None;
            }
            let result: string | undefined = shards.at(-1);
            if (!result) {
                return TsResult.None;
            }
            return new TsResult.Some<string>(result);   
        }

        public directory(): TsResult.Option<IDirectory> {
            if (!this.path().exists().unwrapOr(false)) {
                return TsResult.None;
            }
            let result: string = "";
            let shards: string[]
                = this.path().toString()
                    ?.split("/");
            shards
                ?.pop();
            shards.forEach(shard => result += (shard + "/"));
            if (result === "") {
                return TsResult.None;
            }
            return new TsResult.Some<Directory>(new Directory(new Path(result)));
        }

        public content(): TsResult.Result<Buffer, unknown> {
            if (!this.path().exists().unwrapOr(false)) {
                return new TsResult.Err<string>("Host::File::PathNotFound");
            }
            try {
                return new TsResult.Ok<Buffer>(FileSystem.readFileSync(this.path().toString()));
            }
            catch (error: unknown) {
                return new TsResult.Err<unknown>(error);
            }
        }

        public delete(): TsResult.Result<void, unknown> {
            if (!this.path().exists().unwrapOr(false)) {
                return new TsResult.Err<string>("Host::File::PathNotFound");
            }
            try {
                return new TsResult.Ok<void>(FileSystem.unlinkSync(this.path().toString()));
            }
            catch (error: unknown) {
                return new TsResult.Err<unknown>(error);
            }
        }

        public create(override: boolean = false): TsResult.Result<void, unknown> {
            try {
                /**
                 * NOTE If any failure occurs during the exists process by default
                 *      process will assume that the file exists as to not override
                 *      important data if anything goes wrong. Only when the process
                 *      functions properly and is sure that the file does nto exist
                 *      will it be generated and overriden by default.
                 */
                if (!this.path().exists().unwrapOr(false)) {
                    return new TsResult.Ok<void>(FileSystem.writeFileSync(this.path().toString(), ""));
                }
                else {
                    /**
                     * NOTE Must give explicit permission to override the file 
                     *      if it exists.
                     */
                    if (override) {
                        return new TsResult.Ok<void>(FileSystem.writeFileSync(this.path().toString(), ""));
                    }
                    /**
                     * NOTE No action was performed because the file exists and
                     *      override permission was not given. Gracefully passes
                     *      this outcome as an error.
                     */
                    return new TsResult.Err<string>("Host::File::Forbidden");
                }
            }
            catch (error: unknown) {
                return new TsResult.Err<unknown>(error);
            }
        }
    }

    export class HtmlFile extends File implements IHtmlFile {
        public constructor(path: IPath) {
            super(path);
            if (new File(path).extension().unwrapOr(undefined) !== "html") {
                this._isBroken = true;
            }
        }
    }

    export class SolFile extends File implements ISolFile {
        public constructor(path: IPath) {
            super(path);
            if (new File(path).extension().unwrapOr(undefined) !== "sol") {
                this._isBroken = true;
            }
        }

        public temporaryPath(): TsResult.Option<IPath> {
            let name: TsResult.Option<string> = this.name();
            if (name.none) {
                return TsResult.None;
            }
            let extension: TsResult.Option<string> = this.extension();
            if (extension.none) {
                return TsResult.None;
            }
            let temporaryPath: IPath = new Path(`${__dirname}/${name.unwrap()}.${extension.unwrap()}`);
            return new TsResult.Some<IPath>(temporaryPath);
        }

        public override content(): TsResult.Result<Buffer, unknown> {
            let path: IPath = this.path();
            if (!this.path().exists().unwrapOr(false)) {
                return new TsResult.Err<string>("SolFile: path does not exist");
            }
            let temporaryPathOption: TsResult.Option<IPath> = this.temporaryPath();
            if (temporaryPathOption.none) {
                return new TsResult.Err<string>("SolFile: unable to parse temporary path");
            }
            let temporaryPath: IPath = temporaryPathOption.unwrap();
            let command: string = `bun hardhat flatten ${path.toString()} > ${temporaryPath.toString()}`;
            ChildProcess.exec(command);
            let beginTimestamp: number = Date.now();
            let nowTimestamp: number = beginTimestamp;
            while (nowTimestamp - beginTimestamp < 2000) {
                nowTimestamp = Date.now();
            }
            let temporaryFile: File = new File(temporaryPath);
            let contentResult: TsResult.Result<Buffer, unknown> = temporaryFile.content();
            if (contentResult.err) {
                return contentResult;
            }
            let result: Buffer = contentResult.unwrap();
            let deleteResult: TsResult.Result<void, unknown> = temporaryFile.delete();
            if (deleteResult.err) {
                console.log(`SolFile: failed to clean up '${temporaryFile.path().toString()}' whilst compiling ${this.path().toString()}`);
            }
            return new TsResult.Ok<Buffer>(result);
        }

        public output(): TsResult.Result<ISolcCompilationOutput, unknown> {
            let nameOption: TsResult.Option<string> = this.name();
            if (nameOption.none) {
                return new TsResult.Err<string>("SolFile: unable to parse file name");
            }
            let contentResult: TsResult.Result<Buffer, unknown> = this.content();
            if (contentResult.err) {
                return contentResult;
            }
            let name: string = nameOption.unwrap();
            let buffer: Buffer = contentResult.unwrap();
            let encoding = "utf8" as const;
            let contentDecoded: string = buffer.toString(encoding);
            return new TsResult.Ok<ISolcCompilationOutput>(JSON.parse(Solc.compile(JSON.stringify({
                language: "Solidity",
                sources: {[name]: {
                    content: contentDecoded
                }},
                settings: {outputSelection: {"*": {"*": [
                    "abi",
                    "evm.bytecode",
                    "evm.methodIdentifiers"
                ]}}}
            }))));
        }

        public errors(): TsResult.Result<string[], unknown> {
            let result: string[] = [];
            let outputResult: TsResult.Result<ISolcCompilationOutput, unknown> = this.output();
            if (outputResult.err) {
                return outputResult;
            }
            let compiled: ISolcCompilationOutput = outputResult.unwrap();
            let outputErrorsAndWarnings: ISolcCompilationErrorOrWarning[] = compiled.errors;
            outputErrorsAndWarnings.forEach(errorOrWarning => {
                if (errorOrWarning.severity !== "error") {
                    return;
                }
                let error: ISolcCompilationErrorOrWarning = errorOrWarning;
                result.push(error.formattedMessage);
            });
            return new TsResult.Ok<string[]>(result);
        }

        public warnings(): TsResult.Result<string[], unknown> {
            let result: string[] = [];
            let outputResult: TsResult.Result<ISolcCompilationOutput, unknown> = this.output();
            if (outputResult.err) {
                return outputResult;
            }
            let compiled: ISolcCompilationOutput = outputResult.unwrap();
            let outputErrorsAndWarnings: ISolcCompilationErrorOrWarning[] = compiled.errors;
            outputErrorsAndWarnings.forEach(errorOrWarning => {
                if (errorOrWarning.severity === "error") {
                    return;
                }
                let warning: ISolcCompilationErrorOrWarning = errorOrWarning;
                result.push(warning.formattedMessage);
            });
            return new TsResult.Ok<string[]>(result);
        }

        public bytecode(): TsResult.Result<string, unknown> {
            let nameOption: TsResult.Option<string> = this.name();
            if (nameOption.none) {
                return new TsResult.Err<string>("SolFile: unable to parse name");
            }
            let name: string = nameOption.unwrap();
            let errorsResult: TsResult.Result<string[], unknown> = this.errors();
            if (errorsResult.err) {
                return errorsResult;
            }
            let errors: string[] = errorsResult.unwrap();
            if (errors.length !== 0) {
                return new TsResult.Err<string>("SolFile: source code error");
            }
            let outputResult: TsResult.Result<ISolcCompilationOutput, unknown> = this.output();
            if (outputResult.err) {
                return outputResult;
            }
            let compiled: ISolcCompilationOutput = outputResult.unwrap();
            let result: string = compiled
                ?.contracts
                ?.[name]
                ?.[name]
                ?.evm
                ?.bytecode
                ?.object ?? "";
            if (result === "") {
                return new TsResult.Err<string>("SolFile: empty bytecode");
            }
            return new TsResult.Ok<string>(result);
        }

        public abi(): TsResult.Result<object[] | string[], unknown> {
            let nameOption: TsResult.Option<string> = this.name();
            if (nameOption.none) {
                return new TsResult.Err<string>("SolFile: unable to parse name");
            }
            let name: string = nameOption.unwrap();
            let errorsResult: TsResult.Result<string[], unknown> = this.errors();
            if (errorsResult.err) {
                return errorsResult;
            }
            let errors: string[] = errorsResult.unwrap();
            if (errors.length !== 0) {
                return new TsResult.Err<string>("SolFile: source code error");
            }
            let outputResult: TsResult.Result<ISolcCompilationOutput, unknown> = this.output();
            if (outputResult.err) {
                return outputResult;
            }
            let output: ISolcCompilationOutput = outputResult.unwrap();
            let result: object[] | string[] = output
                ?.contracts
                ?.[name]
                ?.[name]
                ?.abi;
            return new TsResult.Ok<object[] | string[]>(result);
        }

        public methods(): TsResult.Result<object, unknown> {
            let nameOption: TsResult.Option<string> = this.name();
            if (nameOption.none) {
                return new TsResult.Err<string>("SolFile: unable to parse name");
            }
            let name: string = nameOption.unwrap();
            let errorsResult: TsResult.Result<string[], unknown> = this.errors();
            if (errorsResult.err) {
                return errorsResult;
            }
            let errors: string[] = errorsResult.unwrap();
            if (errors.length !== 0) {
                return new TsResult.Err<string>("SolFile: source code error");
            }
            let outputResult: TsResult.Result<ISolcCompilationOutput, unknown> = this.output();
            if (outputResult.err) {
                return outputResult;
            }
            let output: ISolcCompilationOutput = outputResult.unwrap();
            let result: object = output
                ?.contracts
                ?.[name]
                ?.[name]
                ?.evm
                ?.methodIdentifiers;
            return new TsResult.Ok<object>(result);
        }
    }

    export class TsxFile extends File implements ITsxFile {
        public constructor(path: IPath) {
            super(path);
            if (new File(path).extension().unwrapOr(undefined) !== "tsx") {
                this._isBroken = true;
            }
        }

        public transpile(directory?: IDirectory | undefined): TsResult.Result<Buffer, unknown> {
            try {
                if (!directory) {
                    if (this.directory().none) {
                        return new TsResult.Err<string>("TsxFile: Unable to find parent directory.");
                    }
                    return new TsResult.Ok<Buffer>(ChildProcess.execSync(`bun build ${this.path().toString()} --outdir ${this.directory().unwrap().path().toString()}`));
                }
                return new TsResult.Ok<Buffer>(ChildProcess.execSync(`bun build ${this.path().toString()} --outdir ${directory.path().toString()}`));
            }
            catch (error: unknown) {
                return new TsResult.Err<unknown>(error);
            }
        }
    }

    export class Server {
        private constructor() {}

        protected static _express: Express.Express = Express();
        protected static _app: unknown;

        public static isConnected(): boolean {
            return !!this._app;
        }

        public static bindRoot(path: IPath): typeof Server {
            this._express.use(Express.static(path.toString()));
            return this;
        }

        public static expose(url: IUrl, handler: (request: Express.Request, response: Express.Response) => void): typeof Server {
            this._express.get(url.toString(), handler);
            return this;
        }

        public static exposeReactApp(directory: IDirectory, url: IUrl): TsResult.Result<typeof Server, unknown> {
            let tsxFilePath: TsResult.Option<IPath> = TsResult.None;
            let htmlFilePath: TsResult.Option<IPath> = TsResult.None;
            directory.files().unwrapOr([]).forEach(file => {
                if (file.name().unwrapOr(undefined) === "App" && file.extension().unwrapOr(undefined) === "tsx") {
                    tsxFilePath = new TsResult.Some<IPath>(file.path());
                }
                if (file.name().unwrapOr(undefined) === "App" && file.extension().unwrapOr(undefined) === "html") {
                    htmlFilePath = new TsResult.Some<IPath>(file.path());
                }
            });
            if (tsxFilePath.none) {
                return new TsResult.Err<string>("Host::MissingTsxAppFile");
            }
            if (htmlFilePath.none) {
                return new TsResult.Err<string>("Host::MissingHtmlAppFile");
            }
            let tsxFile: ITsxFile = new TsxFile((tsxFilePath as TsResult.Option<IPath>).unwrap());
            let htmlFile: IHtmlFile = new HtmlFile((htmlFilePath as TsResult.Option<IPath>).unwrap());
            if (tsxFile.isBroken()) {
                return new TsResult.Err<string>("Host::BrokenTsxFile");
            }
            if (htmlFile.isBroken()) {
                return new TsResult.Err<string>("Host::BrokenHtmlFile");
            }
            let buffer: TsResult.Result<Buffer, unknown> = tsxFile.transpile();
            if (buffer.err) {
                return buffer;
            }
            let output: Buffer = buffer.unwrap();
            console.log(output.toString("utf8"));
            this.bindRoot(directory.path());
            this.expose(url, function(request, response) {
                response
                    .status(200)
                    .sendFile(htmlFile.path().toString());
                return;
            });
            return new TsResult.Ok<typeof Server>(this);
        }

        public static boot(port: bigint = 3000n): TsResult.Result<typeof Server, unknown> {
            if (!this.isConnected()) {
                let boot: TsResult.Result<typeof Server, unknown> = this._boot(port);
                if (boot.err) {
                    return boot;
                }
                return boot;
            }
            let shutdown: TsResult.Result<typeof Server, unknown> = this._shutdown();
            if (shutdown.err) {
                return shutdown;
            }
            let boot: TsResult.Result<typeof Server, unknown> = this._boot(port);
            if (boot.err) {
                return boot;
            }
            return boot;
        }
    
        public static shutdown(): TsResult.Result<typeof Server, unknown> {
            return this._shutdown();
        }
    
        protected static _boot(port: bigint = 3000n): TsResult.Result<typeof Server, unknown> {
            try {
                this._app = this._express.listen(Number(port));
                return new TsResult.Ok<typeof Server>(this);
            }
            catch (error: unknown) {
                return new TsResult.Err<unknown>(error);
            }
        }
    
        protected static _shutdown(): TsResult.Result<typeof Server, unknown> {
            try {
                (this._app as any).close();
                return new TsResult.Ok<typeof Server>(this);
            }
            catch (error: unknown) {
                return new TsResult.Err<unknown>(error);
            }
        }
    }

    export class ConstructorTransaction implements ITransaction {
        public constructor(protected _payload: IConstructorTransactionConstructorPayload) {}

        public async receipt(): Promise<TsResult.Result<Ethers.TransactionReceipt | null, unknown>> {
            try {
                const node: Ethers.JsonRpcProvider = new Ethers.JsonRpcProvider(this._payload.rpcUrl);
                const wallet: Ethers.Wallet = new Ethers.Wallet(this._payload.privateKey, node);
                return new TsResult.Ok(await (await wallet.sendTransaction({
                    from: await wallet.getAddress(),
                    to: null,
                    nonce: await wallet.getNonce(),
                    gasPrice: 
                        this._payload.gasPrice === "veryLow"
                            ? 20000000000n : 
                        this._payload.gasPrice === "low"
                            ? 30000000000n : 
                        this._payload.gasPrice === "standard"
                            ? 50000000000n : 
                        this._payload.gasPrice === "fast"
                            ? 70000000000n : 
                        this._payload.gasPrice === undefined
                            ? 20000000000n : 
                        this._payload.gasPrice,
                    gasLimit: this._payload.gasLimit ?? 10000000n,
                    value: 0n,
                    data: `0x${this._payload.bytecode.bytecode().unwrap()}`,
                    chainId: this._payload.chainId ?? (await node.getNetwork()).chainId
                })).wait(Number(this._payload.confirmations)));
            }
            catch (error: unknown) {
                return new TsResult.Err<unknown>(error);
            }
        }
    }

    export class Transaction implements ITransaction {
        public constructor(protected _payload: ITransactionConstructorPayload) {}

        public async receipt(): Promise<TsResult.Result<Ethers.TransactionReceipt | null, unknown>> {
            try {
                const node: Ethers.JsonRpcProvider = new Ethers.JsonRpcProvider(this._payload.rpcUrl);
                const wallet: Ethers.Wallet = new Ethers.Wallet(this._payload.privateKey, node);
                return new TsResult.Ok(await (await wallet.sendTransaction({
                    from: wallet.getAddress(),
                    to: this._payload.to,
                    nonce: await wallet.getNonce(),
                    gasPrice:
                        this._payload.gasPrice === "veryLow"
                            ? 20000000000n : 
                        this._payload.gasPrice === "low"
                            ? 30000000000n : 
                        this._payload.gasPrice === "standard"
                            ? 50000000000n : 
                        this._payload.gasPrice === "fast"
                            ? 70000000000n : 
                        this._payload.gasPrice === undefined
                            ? 20000000000n : 
                        this._payload.gasPrice,
                    gasLimit: this._payload.gasLimit ?? 10000000n,
                    value: this._payload.value ?? 0n,
                    data: new Ethers.Interface([
                        this._payload.methodSignature
                    ]).encodeFunctionData(this._payload.methodName, this._payload.methodArgs),
                    chainId: this._payload.chainId ??  (await node.getNetwork()).chainId
                })).wait(Number(this._payload.confirmations ?? 0n)));
            }
            catch (error: unknown) {
                return new TsResult.Err<unknown>(error);
            }
        }
    }

    export class Query implements IQuery {
        public constructor(protected _payload: IQueryConstructorPayload) {}

        public async response(): Promise<unknown> {
            const node: Ethers.JsonRpcProvider = new Ethers.JsonRpcProvider(this._payload.rpcUrl);
            return await (new Ethers.Contract(
                this._payload.address, [
                    this._payload.methodSignature
                ],
                node
            )).getFunction(this._payload.methodName)(...this._payload.methodArgs);
        }
    }
}