import type {SolErrorCode} from "@doka/SolErrorCode";
import {require} from "@lib/ErrorHandler";
import {existsSync} from "fs";
import {readFileSync} from "fs";
import {unlinkSync} from "fs";
import {join} from "path";
import {exec} from "child_process";
import Solc from "solc";

export type Sol = {
    path(): string;
    bytecode(): string;
    abstractBinaryInterface(): object[];
    errors(): string[];
    warnings(): string[];
}

export function Sol(_path: string): Sol {
    let _bytecode: string = "";
    let _abstractBinaryInterface: object[] = [];
    let _errors: string[] = [];
    let _warnings: string[] = [];

    /***/ {
        require<SolErrorCode>(existsSync(_path), "sol-missing-path");
        let name:
            | string
            | undefined
            = _path
                ?.split("\\")
                ?.pop()
                ?.split(".")
                ?.at(-2);
        require<SolErrorCode>(!!name, "sol-failed-to-parse-file-name");
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
        require<SolErrorCode>(!!extension, "sol-failed-to-parse-file-extension");
        let temporaryPath: string = join(__dirname, `${name}.${extension}`);
        let src: string = "";
        try {
            let command: string = `bun hardhat flatten ${_path} > ${temporaryPath}`;
            exec(command);
            let beginTimestamp: number = Date.now();
            let nowTimestamp: number = beginTimestamp;
            while (nowTimestamp - beginTimestamp < 4000) {
                nowTimestamp = Date.now();
            }
            let content: string = readFileSync(temporaryPath, "utf-8");
            require<SolErrorCode>(content !== "", "sol-failed-to-parse-file-content");
            src = content;
        }
        finally {
            unlinkSync(temporaryPath);
        }
        let out: unknown = JSON.parse((Solc as any).compile(JSON.stringify({
            language: "Solidity",
            sources: {[name!]: {content: src}},
            settings: {outputSelection: {"*": {"*": ["abi", "evm.bytecode"]}}}
        })));
        let errorsAndWarnings: unknown[] = (out as any)?.errors ?? [];
        for (let i = 0; i < errorsAndWarnings.length; i ++) {
            let errorOrWarning: unknown = errorsAndWarnings[i];
            if (!(
                errorOrWarning
                && typeof errorOrWarning === "object"
                && "severity" in errorOrWarning
                && "formattedMessage" in errorOrWarning
                && typeof errorOrWarning.severity === "string"
                && typeof errorOrWarning.formattedMessage === "string"
            )) {
                require<SolErrorCode>(false, "sol-type-error");
            }
            let formattedMessage: string = (errorOrWarning as any).formattedMessage;
            if ((errorOrWarning as any).severity === "error") {
                _errors.push(formattedMessage);
            }
            else {
                _warnings.push(formattedMessage);
            }
        }
        let bytecode_: unknown
            = (out as any)
                ?.contracts
                ?.[name!]
                ?.[name!]
                ?.evm
                ?.bytecode
                ?.object;
        require<SolErrorCode>(!!bytecode_, "sol-type-error");
        require<SolErrorCode>(typeof bytecode_ === "string", "sol-type-error");
        _bytecode = (bytecode_ as string);
        let abstractBinaryInterface_: unknown
            = (out as any)
                ?.contracts
                ?.[name!]
                ?.[name!]
                ?.abi;
        require<SolErrorCode>(!!abstractBinaryInterface_, "sol-type-error");
        require<SolErrorCode>(Array.isArray(abstractBinaryInterface_), "sol-type-error");
        _abstractBinaryInterface = (abstractBinaryInterface_ as object[]);
        return {path, bytecode, abstractBinaryInterface, errors, warnings};
    }

    function path(): string {
        return _path;
    }

    function bytecode(): string {
        return _bytecode;
    }

    function abstractBinaryInterface(): object[] {
        return _abstractBinaryInterface;
    }

    function errors(): string[] {
        return _errors;
    }

    function warnings(): string[] {
        return _warnings;
    }
}