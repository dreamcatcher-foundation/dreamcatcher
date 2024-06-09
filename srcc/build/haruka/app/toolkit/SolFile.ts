import type { IFile } from "@HarukaToolkitBundle";
import type { IPath } from "@HarukaToolkitBundle";
import { File } from "@HarukaToolkitBundle";
import { Path } from "@HarukaToolkitBundle";
import { Result } from "@HarukaToolkitBundle";
import { Option } from "@HarukaToolkitBundle";
import { Some } from "@HarukaToolkitBundle";
import { None } from "@HarukaToolkitBundle";
import { Err } from "@HarukaToolkitBundle";
import { Ok } from "@HarukaToolkitBundle";
import { exec } from "@HarukaToolkitBundle";
import solc from "solc";

interface ISolcCompilationErrorOrWarning {
    severity: string;
    formattedMessage: string;
}

interface ISolcCompilationOutput {
    errors: ISolcCompilationErrorOrWarning[];
    contracts: {[contractName: string]: {[contractName: string]: {
        abi: object[] | string[];
        evm: {
            methodIdentifiers: object;
            bytecode: {
                object: string;
            }
        }
    }}};
}

interface ISolFile extends IFile {
    temporaryPath(): Option<IPath>;
    output(): Result<ISolcCompilationOutput, unknown>;
    errors(): Result<string[], unknown>;
    warnings(): Result<string[], unknown>;
    bytecode(): Result<string, unknown>;
    abi(): Result<object[] | string[], unknown>;
    methods(): Result<object, unknown>;
}

function SolFile({path}: {path: IPath}): Result<ISolFile, unknown> {
    let self: ISolFile = {
        ...File({path: path}),
        temporaryPath,
        content,
        output,
        errors,
        warnings,
        bytecode,
        abi,
        methods
    };

    if (self.extension().unwrapOr(undefined) !== "sol") {
        return Err<string>("SOLFile: Incompatible extension.");
    }

    function temporaryPath(): Option<IPath> {
        let nameOption: Option<string> = self.name();
        if (nameOption.none) {
            return None;
        }
        let name: string = nameOption.unwrap();
        let extensionOption: Option<string> = self.extension();
        if (extensionOption.none) {
            return None;
        }
        let extension: string = extensionOption.unwrap();
        let temporaryPath: IPath = Path({string: `${__dirname}/${name}.${extension}`});
        return Some<IPath>(temporaryPath);
    }

    function content(): Result<Buffer, unknown> {
        let pathString: string = self.path().toString();
        let temporaryPathOption: Option<IPath> = temporaryPath();
        if (temporaryPathOption.none) {
            return Err("SolFile: Unable to parse temporary path.");
        }
        let tempPath: IPath = temporaryPathOption.unwrap();
        let temporaryPathString: string = tempPath.toString();
        let command: string = `bun hardhat flatten ${pathString} > ${temporaryPathString}`;
        exec(command);
        let beginTimestamp: number = Date.now();
        let nowTimestamp: number = beginTimestamp;
        while (nowTimestamp - beginTimestamp < 500) {
            nowTimestamp = Date.now();
        }
        let temporaryFile: IFile = File({path: tempPath});
        let contentResult: Result<Buffer, unknown> = temporaryFile.content();
        if (contentResult.err) {
            return contentResult;
        }
        let result: Buffer = contentResult.unwrap();
        let removeResult: Result<void, unknown> = temporaryFile.remove();
        if (removeResult.err) {
            return removeResult;
        }
        return Ok<Buffer>(result);
    }

    function output(): Result<ISolcCompilationOutput, unknown> {
        let nameOption: Option<string> = self.name();
        if (nameOption.none) {
            return Err("SolFile: Unable to parse file name.");
        }
        let contentResult: Result<Buffer, unknown> = content();
        if (contentResult.err) {
            return contentResult;
        }
        let name: string = nameOption.unwrap();
        let buffer: Buffer = contentResult.unwrap();
        let encoding = "utf8" as const;
        let contentDecoded: string = buffer.toString(encoding);
        return Ok<ISolcCompilationOutput>(JSON.parse(solc.compile(JSON.stringify({
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

    function errors(): Result<string[], unknown> {
        let result: string[] = [];
        let outputResult: Result<ISolcCompilationOutput, unknown> = output();
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
        return Ok<string[]>(result);
    }

    function warnings(): Result<string[], unknown> {
        let result: string[] = [];
        let outputResult: Result<ISolcCompilationOutput, unknown> = output();
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
        return Ok<string[]>(result);
    }

    function bytecode(): Result<string, unknown> {
        let nameOption: Option<string> = self.name();
        if (nameOption.none) {
            return Err("SolFile: Unable to parse name.");
        }
        let name: string = nameOption.unwrap();
        let errorsResult: Result<string[], unknown> = errors();
        if (errorsResult.err) {
            return errorsResult;
        }
        let errorsUnwrapped: string[] = errorsResult.unwrap();
        if (errorsUnwrapped.length !== 0) {
            return Err("SolFile: Source code issue.");
        }
        let outputResult: Result<ISolcCompilationOutput, unknown> = output();
        if (outputResult.err) {
            return outputResult;
        }
        let outputUnwrapped: ISolcCompilationOutput = outputResult.unwrap();
        let result: string = outputUnwrapped
            ?.contracts
            ?.[name]
            ?.[name]
            ?.evm
            ?.bytecode
            ?.object ?? "";
        if (result === "") {
            return Err("SolFile: Empty bytecode.");
        }
        return Ok<string>(result);
    }

    function abi(): Result<object[] | string[], unknown> {
        let nameOption: Option<string> = self.name();
        if (nameOption.none) {
            return Err("SolFile: Unable to parse name.");
        }
        let name: string = nameOption.unwrap();
        let errorsResult: Result<string[], unknown> = errors();
        if (errorsResult.err) {
            return errorsResult;
        }
        let errorsUnwrapped: string[] = errorsResult.unwrap();
        if (errorsUnwrapped.length !== 0) {
            return Err("SolFile: Source code issue.");
        }
        let outputResult: Result<ISolcCompilationOutput, unknown> = output();
        if (outputResult.err) {
            return outputResult;
        }
        let outputUnwrapped: ISolcCompilationOutput = outputResult.unwrap();
        let result: object[] | string[] = outputUnwrapped
            ?.contracts
            ?.[name]
            ?.[name]
            ?.abi;
        return Ok<object[] | string[]>(result);
    }

    function methods(): Result<object, unknown> {
        let nameOption: Option<string> = self.name();
        if (nameOption.none) {
            return Err("SolFile: Unable to parse name.");
        }
        let name: string = nameOption.unwrap();
        let errorsResult: Result<string[], unknown> = errors();
        if (errorsResult.err) {
            return errorsResult;
        }
        let errorsUnwrapped: string[] = errorsResult.unwrap();
        if (errorsUnwrapped.length !== 0) {
            return Err("SolFile: Source code issue.");
        }
        let outputResult: Result<ISolcCompilationOutput, unknown> = output();
        if (outputResult.err) {
            return outputResult;
        }
        let outputUnwrapped: ISolcCompilationOutput = outputResult.unwrap();
        let result: object = outputUnwrapped
            ?.contracts
            ?.[name]
            ?.[name]
            ?.evm
            ?.methodIdentifiers;
        return Ok<object>(result);
    }

    return Ok<ISolFile>(self);
}

export type { ISolcCompilationErrorOrWarning };
export type { ISolcCompilationOutput };
export type { ISolFile };
export { SolFile };