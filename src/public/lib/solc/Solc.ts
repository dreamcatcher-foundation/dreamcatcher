import type { ExecException } from "child_process";
import { Ok } from "@lib/Result"
import { Err } from "@lib/Result";
import { join } from "path";
import { exec } from "child_process";
import { readFileSync } from "fs";
import { unlinkSync } from "fs";
import { existsSync } from "fs";
/// @ts-ignore
import Solc from "solc";

export interface Sol {
    path: string;
    bytecode: string;
    abi: object[];
    methods: { [method: string]: string };
    warnings: string[];
}

export function Sol(_: Sol): Sol {
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
    | Err<"MISSING_PATH">
    | Err<"INCOMPATIBLE_FILE_TYPE">
    | Err<"FAILED_TO_PARSE_FILE_NAME">
    | Err<"FAILED_TO_PARSE_FILE_EXTENSION">
    | Err<"FAILED_TO_PARSE_FILE_CONTENT">
    | Err<"CORRUPTION">;

export function compile(_path: string): CompilationResult {
    if (!existsSync(_path)) return Err<"MISSING_PATH">("MISSING_PATH");
    let name:
        | string
        | undefined
        = _path
            ?.split("\\")
            ?.pop()
            ?.split(".")
            ?.at(-2);
    if (!name) return Err<"FAILED_TO_PARSE_FILE_NAME">("FAILED_TO_PARSE_FILE_NAME");
    let shards:
        | string[]
        | undefined
        = _path
            ?.split("/")
            ?.pop()
            ?.split(".");
    if (!shards) return Err<"FAILED_TO_PARSE_FILE_EXTENSION">("FAILED_TO_PARSE_FILE_EXTENSION");
    let extension:
        | string
        | undefined
        = shards.at(-1);
    if (!extension) return Err<"FAILED_TO_PARSE_FILE_EXTENSION">("FAILED_TO_PARSE_FILE_EXTENSION");
    let temporaryPath: string = join(__dirname, `${name}.${extension}`);
    let sourcecode: string = "";
    try {
        let exception!:
            | ExecException
            | null;
        exec(`bun hardhat flatten ${_path} > ${temporaryPath}`, e => exception = e);
        let beginTimestamp: number = Date.now();
        let nowTimestamp: number = beginTimestamp;
        while (nowTimestamp - beginTimestamp < 4000) nowTimestamp = Date.now();
        if (exception) return Err<ExecException>(exception);
        let item: string = readFileSync(temporaryPath, "utf8");
        if (item === "") return Err<"FAILED_TO_PARSE_FILE_CONTENT">("FAILED_TO_PARSE_FILE_CONTENT");
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
            )) return Err<"CORRUPTION">("CORRUPTION");
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
            if (!bytecode) return Err<"CORRUPTION">("CORRUPTION");
            if (!abi) return Err<"CORRUPTION">("CORRUPTION");
            if (!methods) return Err<"CORRUPTION">("CORRUPTION");
            if (!(
                bytecode
                && typeof bytecode === "string"
                && bytecode !== ""
            )) return Err<"CORRUPTION">("CORRUPTION");
            if (!(
                abi
                && Array.isArray(abi)
                && abi.length !== 0
                && typeof abi[0] === "object"
            )) return Err<"CORRUPTION">("CORRUPTION");
            if (!(
                methods
                && typeof methods === "object"
            )) return Err<"CORRUPTION">("CORRUPTION");
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