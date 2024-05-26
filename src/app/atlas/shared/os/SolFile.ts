import { File } from "@atlas/shared/os/File.ts";
import { Path } from "@atlas/shared/os/Path.ts";
import { Result } from "ts-results";
import { Option } from "ts-results";
import { Some } from "ts-results";
import { None } from "ts-results";
import { Ok } from "ts-results";
import { Err } from "ts-results";
import { exec } from "child_process";
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

class SolFile extends File {
    public constructor(path: Path) {
        if (new File(path).extension().unwrapOr(undefined) !== "sol") {
            super(path, true);
        }
        else {
            super(path, false);
        }
    }

    public temporaryPath(): Option<Path> {
        let nameOption: Option<string> = this.name();
        if (nameOption.none) {
            return None;
        }
        let name: string = nameOption.unwrap();
        let extensionOption: Option<string> = this.extension();
        if (extensionOption.none) {
            return None;
        }
        let extension: string = extensionOption.unwrap();
        let temporaryPath: Path = new Path(`${__dirname}/${name}.${extension}}`);
        return new Some<Path>(temporaryPath);
    }

    public override content(): Result<Buffer, unknown> {
        let path: Path = this.path();
        if (!this.path().exists().unwrapOr(false)) {
            return new Err<string>("SolFile: path does not exist");
        }
        let temporaryPathOption: Option<Path> = this.temporaryPath();
        if (temporaryPathOption.none) {
            return new Err<string>("SolFile: unable to parse temporary path");
        }
        let temporaryPath: Path = temporaryPathOption.unwrap();
        let command: string = `bun hardhat flatten ${path.toString()} > ${temporaryPath.toString()}`;
        exec(command);
        let beginTimestamp: number = Date.now();
        let nowTimestamp: number = beginTimestamp;
        while (nowTimestamp - beginTimestamp < 500) {
            nowTimestamp = Date.now();
        }
        let temporaryFile: File = new File(temporaryPath);
        let contentResult: Result<Buffer, unknown> = temporaryFile.content();
        if (contentResult.err) {
            return contentResult;
        }
        let result: Buffer = contentResult.unwrap();
        let deleteResult: Result<void, unknown> = temporaryFile.delete();
        if (deleteResult.err) {
            console.log(`SolFile: failed to clean up '${temporaryFile.path().toString()}' whilst compiling ${this.path().toString()}`);
        }
        return new Ok<Buffer>(result);
    }

    public output(): Result<ISolcCompilationOutput, unknown> {
        let nameOption: Option<string> = this.name();
        if (nameOption.none) {
            return new Err<string>("SolFile: unable to parse file name");
        }
        let contentResult: Result<Buffer, unknown> = this.content();
        if (contentResult.err) {
            return contentResult;
        }
        let name: string = nameOption.unwrap();
        let buffer: Buffer = contentResult.unwrap();
        let encoding = "utf8" as const;
        let contentDecoded: string = buffer.toString(encoding);
        return new Ok<ISolcCompilationOutput>(JSON.parse(solc.compile(JSON.stringify({
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

    public errors(): Result<string[], unknown> {
        let result: string[] = [];
        let outputResult: Result<ISolcCompilationOutput, unknown> = this.output();
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
        return new Ok<string[]>(result);
    }

    public warnings(): Result<string[], unknown> {
        let result: string[] = [];
        let outputResult: Result<ISolcCompilationOutput, unknown> = this.output();
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
        return new Ok<string[]>(result);
    }

    public bytecode(): Result<string, unknown> {
        let nameOption: Option<string> = this.name();
        if (nameOption.none) {
            return new Err<string>("SolFile: unable to parse name");
        }
        let name: string = nameOption.unwrap();
        let errorsResult: Result<string[], unknown> = this.errors();
        if (errorsResult.err) {
            return errorsResult;
        }
        let errors: string[] = errorsResult.unwrap();
        if (errors.length !== 0) {
            return new Err<string>("SolFile: source code error");
        }
        let outputResult: Result<ISolcCompilationOutput, unknown> = this.output();
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
            return new Err<string>("SolFile: empty bytecode");
        }
        return new Ok<string>(result);
    }

    public abi(): Result<object[] | string[], unknown> {
        let nameOption: Option<string> = this.name();
        if (nameOption.none) {
            return new Err<string>("SolFile: unable to parse name");
        }
        let name: string = nameOption.unwrap();
        let errorsResult: Result<string[], unknown> = this.errors();
        if (errorsResult.err) {
            return errorsResult;
        }
        let errors: string[] = errorsResult.unwrap();
        if (errors.length !== 0) {
            return new Err<string>("SolFile: source code error");
        }
        let outputResult: Result<ISolcCompilationOutput, unknown> = this.output();
        if (outputResult.err) {
            return outputResult;
        }
        let output: ISolcCompilationOutput = outputResult.unwrap();
        let result: object[] | string[] = output
            ?.contracts
            ?.[name]
            ?.[name]
            ?.abi;
        return new Ok<object[] | string[]>(result);
    }

    public methods(): Result<object, unknown> {
        let nameOption: Option<string> = this.name();
        if (nameOption.none) {
            return new Err<string>("SolFile: unable to parse name");
        }
        let name: string = nameOption.unwrap();
        let errorsResult: Result<string[], unknown> = this.errors();
        if (errorsResult.err) {
            return errorsResult;
        }
        let errors: string[] = errorsResult.unwrap();
        if (errors.length !== 0) {
            return new Err<string>("SolFile: source code error");
        }
        let outputResult: Result<ISolcCompilationOutput, unknown> = this.output();
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
        return new Ok<object>(result);
    }
}

export type { ISolcCompilationErrorOrWarning };
export type { ISolcCompilationOutput };
export { SolFile };