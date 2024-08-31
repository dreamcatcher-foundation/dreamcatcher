import type {ExecException} from "child_process";
import {Ok} from "@lib/Result"
import {Err} from "@lib/Result";
import {join} from "path";
import {exec} from "child_process";
import {readFileSync} from "fs";
import {unlinkSync} from "fs";
import {existsSync} from "fs";
import {require} from "@lib/ErrorHandler";
/// @ts-ignore
import Solc from "solc";
import memoize from "memoize"

export type SolcErrorCode
    =
    | "solc-missing-path"
    | "solc-failed-to-parse-file-name"
    | "solc-failed-to-parse-file-extension"
    | "solc-failed-to-parse-file-content"
    | "solc-type-error";

export type Sol
    = {
        path(): string;
        bytecode(): string;
        abstractBinaryInterface(): object[];
        methods(): {[method: string]: string};
        warnings(): string[];
    };

export function Sol({path, bytecode, abstractBinaryInterface, methods, warnings}: {path: string; bytecode: string; abstractBinaryInterface: object[]; methods: {[method: string]: string;}; warnings: string[];}): Sol {

    function path() {

    }
}

export type FaultySol
    = {
        warnings(): string[];
        errors(): string[];
    };

export function compile(path: string): Solc | FaultySol {
    require<SolcErrorCode>(existsSync(path), "solc-missing-path");
    let name:
        | string
        | undefined
        = path
            ?.split("\\")
            ?.pop()
            ?.split(".")
            ?.at(-2);
    require<SolcErrorCode>(!!name, "solc-failed-to-parse-file-name");
    let shards:
        | string[]
        | undefined
        = path
            ?.split("/")
            ?.pop()
            ?.split(".");
    let extension:
        | string
        | undefined
        = shards?.at(-1);
    require<SolcErrorCode>(!!extension, "solc-failed-to-parse-file-extension");
    let tempPath: string = join(__dirname, `${name}.${extension}`);
    let sourcecode: string = "";
    try {
        let command: string = `bun hardhat flatten ${path} > ${tempPath}`;
        exec(command);
        let beginTimestamp: number = Date.now();
        let nowTimestamp: number = beginTimestamp;
        while (nowTimestamp - beginTimestamp < 4000) nowTimestamp = Date.now();
        let content: string = readFileSync(tempPath, "utf8");
        require<SolcErrorCode>(content !== "", "solc-failed-to-parse-file-content");
        sourcecode = content;
    }
    catch (e: unknown) {
        throw e;
    }
    finally {
        unlinkSync(tempPath);
    }
    let out: unknown = JSON.parse((Solc as any).compile(JSON.stringify({
        language: "Solidity",
        sources: {[name!]: {content: sourcecode}},
        settings: {outputSelection: {"*": {"*": ["abi", "evm.bytecode", "evm.methodIdentifiers"]}}}
    })));
    let errors: string[] = [];
    let warnings: string[] = [];
    let errorsAndWarnings: unknown[] = (out as any)?.errors ?? [];
    for (let i = 0; i < errorsAndWarnings.length; i += 1) {
        let errorOrWarning: unknown = errorsAndWarnings[i];
        if (!(
            errorOrWarning
            && typeof errorOrWarning === "object"
            && "severity" in errorOrWarning
            && "formattedMessage" in errorOrWarning
            && typeof errorOrWarning.severity === "string"
            && typeof errorOrWarning.formattedMessage === "string"
        )) require<SolcErrorCode>(false, "solc-type-error");
        let formattedMessage: string = (errorOrWarning as any).formattedMessage;
        if ((errorOrWarning as any).severity === "error") errors.push(formattedMessage);
        else warnings.push(formattedMessage);
    }
    if (errors.length === 0) {
        let bytecode: unknown
            = (out as any)
                ?.contracts
                ?.[name!]
                ?.[name!]
                ?.evm
                ?.bytecode
                ?.object;
        let abstractBinaryInterface: unknown
            = (out as any)
                ?.contracts
                ?.[name!]
                ?.[name!]
                ?.abi;
        let methods: unknown
            = (out as any)
                ?.contracts
                ?.[name!]
                ?.[name!]
                ?.evm
                ?.methodIdentifiers;
        require<SolcErrorCode>(!!bytecode, "solc-type-error");
        require<SolcErrorCode>(!!abstractBinaryInterface, "solc-type-error");
        require<SolcErrorCode>(!!methods, "solc-type-error");
        require<SolcErrorCode>(typeof bytecode === "string", "solc-type-error");
        require<SolcErrorCode>(bytecode !== "", "solc-type-error");
        require<SolcErrorCode>(Array.isArray(abstractBinaryInterface), "solc-type-error");
        require<SolcErrorCode>((abstractBinaryInterface as any).length !== 0, "solc-type-error");
        require<SolcErrorCode>(typeof (abstractBinaryInterface as any)[0] === "object", "solc-type-error");
        require<SolcErrorCode>(typeof (methods as any) === "object", "solc-type-error");
        return Sol({
            path: path,
            bytecode: (bytecode as string),
            abstractBinaryInterface: (abstractBinaryInterface as object[]),
            methods: (methods as {[method: string]: string}),
            warnings: (warnings as string[])
        });
    }

}



function Sols(_path: string) {
    

    const _name = memoize(() => {
        let name:
            | string
            | undefined
            = _path
                ?.split("\\")
                ?.pop()
                ?.split(".")
                ?.at(-2);
        require<SolcErrorCode>(!!name, "solc-failed-to-parse-file-name");
        return name!;
    });

    const _extension = memoize(() => {
        let shards:
            | string[]
            | undefined
            = _path
                ?.split("/")
                ?.pop()
                ?.split(".");
        let extension:
            | string
            | undefined
            = shards?.at(-1);
        require<SolcErrorCode>(!!extension, "solc-failed-to-parse-file-extension");
        return extension!;
    });

    const _tempPath = memoize(() => {
        return join(__dirname, `${_name()}.${_extension()}`);
    });

    const _sourcecode = memoize(() => {
        try {
            exec(`bun hardhat flatten ${_path} > ${_tempPath()}`);
            _busyWait();
            let content: string = readFileSync(_tempPath(), "utf-8");
            require<SolcErrorCode>(content !== "", "solc-failed-to-parse-file-content");
            return content;
        }
        catch (e: unknown) {
            throw e;
        }
        finally {
            try {
                unlinkSync(_tempPath());
            }
            catch (e: unknown) {
                throw e;
            }
        }
    });

    const _busyWait = () => {
        let timestamp0: number = Date.now();
        let timestamp1: number = timestamp0;
        while (timestamp1 - timestamp0 < 3000) timestamp1 = Date.now();
        return;
    }

    const _compile = memoize((): unknown => {
        return JSON.parse((Solc as any).compile(JSON.stringify({
            language: "Solidity",
            sources: {[_name()]: {content: _sourcecode()}},
            settings: {outputSelection: {"*": {"*": ["abi", "evm.bytecode", "evm.methodIdentifiers"]}}}
        })));
    })

    const _errorsAndWarnings = memoize((): unknown[] => {
        return (_compile() as any)?.errors ?? [];
    });

    const _errors = memoize(() => {
        let errors: string[] = [];
        for (let i = 0; i < _errorsAndWarnings().length; i += 1) {
            if (!(
                _errorsAndWarnings()[i]
                && typeof _errorsAndWarnings()[i] === "object"
                && "severity" in (_errorsAndWarnings()[i] as any)
                && "formattedMessage" in (_errorsAndWarnings()[i] as any)
                && typeof (_errorsAndWarnings()[i] as any).severity === "string"
                && typeof (_errorsAndWarnings()[i] as any).formattedMessage === "string"
            )) require<SolcErrorCode>(false, "solc-type-error");
            if ((_errorsAndWarnings()[i] as any).severity === "error") errors.push((_errorsAndWarnings()[i] as any).formattedMessage);
        }
        return errors;
    });

    const _warnings = memoize(() => {
        let warnings: string[] = [];
        for (let i = 0; i < _errorsAndWarnings().length; i += 1) {
            if (!(
                _errorsAndWarnings()[i]
                && typeof _errorsAndWarnings()[i] === "object"
                && "severity" in (_errorsAndWarnings()[i] as any)
                && "formattedMessage" in (_errorsAndWarnings()[i] as any)
                && typeof (_errorsAndWarnings()[i] as any).severity === "string"
                && typeof (_errorsAndWarnings()[i] as any).formattedMessage === "string"
            )) require<SolcErrorCode>(false, "solc-type-error");
            if ((_errorsAndWarnings()[i] as any).severity !== "error") warnings.push((_errorsAndWarnings()[i] as any).formattedMessage);
        }
        return warnings;
    });



    const errors = memoize(() => _errors());

    const warnings = memoize(() => _warnings());

    return {errors, warnings};
}




export interface Sosl {
    path: string;
    bytecode: string;
    abi: object[];
    methods: { [method: string]: string };
    warnings: string[];
}

export function Sosl(_: Sol): Sol {
    return _;
}

export interface SolFailed {
    path: string;
    errors: string[];
    warnings: string[];
}

export function SolFailed(_: SolFailed): SolFailed {
    return _;
}

export type CompilationResult
    =
    | Ok<Sol>
    | Ok<SolFailed>
    | CompilationErr;

export type CompilationErr
    =
    | Err<unknown>
    | Err<ExecException>
    | Err<"missingPath">
    | Err<"incompatibleFileType">
    | Err<"failedToParseFileName">
    | Err<"failedToParseFileExtension">
    | Err<"failedToParseFileContent">
    | Err<"corruption">;

export function compilse(_path: string): CompilationResult {
    if (!existsSync(_path)) return Err<"missingPath">("missingPath");
    let name:
        | string
        | undefined
        = _path
            ?.split("\\")
            ?.pop()
            ?.split(".")
            ?.at(-2);
    if (!name) return Err<"failedToParseFileName">("failedToParseFileName");
    let shards:
        | string[]
        | undefined
        = _path
            ?.split("/")
            ?.pop()
            ?.split(".");
    if (!shards) return Err<"failedToParseFileExtension">("failedToParseFileExtension");
    let extension:
        | string
        | undefined
        = shards.at(-1);
    if (!extension) return Err<"failedToParseFileExtension">("failedToParseFileExtension");
    let temporaryPath: string = join(__dirname, `${name}.${extension}`);
    let sourcecode: string = "";
    try {
        let exception!:
            | ExecException
            | null;
        /// note to self before using this function always initialize a bun hardhat
        /// project or this will not work properly.
        /// bun hardhat - to check if hardhat is installed.
        /// if it is it will come up with some options to create a hardhat project just
        /// initialize with empty config and then everything should work just fine.
        /// number of times i forgot 7.
        exec(`bun hardhat flatten ${_path} > ${temporaryPath}`, e => exception = e);
        console.log(exception);
        let beginTimestamp: number = Date.now();
        let nowTimestamp: number = beginTimestamp;
        while (nowTimestamp - beginTimestamp < 4000) {
            nowTimestamp = Date.now();
        }
        if (exception) return Err<ExecException>(exception);
        let item: string = readFileSync(temporaryPath, "utf8");
        if (item === "") return Err<"failedToParseFileContent">("failedToParseFileContent");
        sourcecode = item;
    }
    catch (e: unknown) {
        return Err<unknown>(e);
    }
    finally {
        try {
            unlinkSync(temporaryPath);
        } 
        catch {}
    }
    try {
        let output: unknown = JSON.parse((Solc as any).compile(JSON.stringify({
            language: "Solidity",
            sources: {[name]:{
                content: sourcecode
            }},
            settings: {outputSelection: {"*": {"*": [
                "abi",
                "evm.bytecode",
                "evm.methodIdentifiers"
            ]}}}
        })));
        let errors: string[] = [];
        let warnings: string[] = [];
        let errorsAndWarnings: unknown[] = (output as any)?.errors ?? [];
        for (let i = 0; i < errorsAndWarnings.length; i += 1) {
            let errorOrWarning: unknown = errorsAndWarnings[i];
            if (!(
                errorOrWarning
                && typeof errorOrWarning === "object"
                && "severity" in errorOrWarning
                && "formattedMessage" in errorOrWarning
                && typeof errorOrWarning.severity === "string"
                && typeof errorOrWarning.formattedMessage === "string"
            )) return Err<"corruption">("corruption");
            if (errorOrWarning.severity === "error") errors.push(errorOrWarning.formattedMessage);
            else warnings.push(errorOrWarning.formattedMessage);
        }
        if (errors.length === 0) {
            let bytecode: unknown
                = (output as any)
                    ?.contracts
                    ?.[name]
                    ?.[name]
                    ?.evm
                    ?.bytecode
                    ?.object;
            let abi: unknown
                = (output as any)
                    ?.contracts
                    ?.[name]
                    ?.[name]
                    ?.abi;
            let methods: unknown
                = (output as any)
                    ?.contracts
                    ?.[name]
                    ?.[name]
                    ?.evm
                    ?.methodIdentifiers;
            if (!bytecode) return Err<"corruption">("corruption");
            if (!abi) return Err<"corruption">("corruption");
            if (!methods) return Err<"corruption">("corruption");
            if (!(
                bytecode
                && typeof bytecode === "string"
                && bytecode !== ""
            )) return Err<"corruption">("corruption");
            if (!(
                abi
                && Array.isArray(abi)
                && abi.length !== 0
                && typeof abi[0] === "object"
            )) return Err<"corruption">("corruption");
            if (!(
                methods
                && typeof methods === "object"
            )) return Err<"corruption">("corruption");
            return Ok<Sol>(Sol({
                path: _path,
                bytecode: bytecode,
                abi: abi,
                /** @unsafe */
                methods: methods as {[method: string]: string},
                warnings: warnings
            }));
        }
    }
    catch (e: unknown) {
        return Err<unknown>(e);
    }
    return Err<"?">("?");
}