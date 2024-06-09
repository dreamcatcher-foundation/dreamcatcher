import { type ISolFile } from "./ISolFile.ts";
import { type IPath } from "../IPath.ts";
import { type IFile } from "./IFile.ts";
import { type ISolcCompilationOutput } from "./solc/ISolcCompilationOutput.ts";
import { File } from "./File.ts";
import { Path } from "../Path.ts";
import { isValidExtension } from "./IFile.ts";
import * as TsResult from "ts-results";
import * as ChildProcess from "child_process";
import Solc from "solc";

export function SolFile(_path: IPath): TsResult.Result<ISolFile, unknown> {
    const _: ISolFile = { ...File(_path), temporaryPath, content, output, errors, warnings, bytecode, abi, methods };

    if (!isValidExtension(_, "sol")) {
        return TsResult.Err<string>("InvalidExtension");
    }

    function temporaryPath(): TsResult.Option<IPath> {
        const name: TsResult.Option<string> = _.name();
        const extension: TsResult.Option<string> = _.extension();
        if (name.none || extension.none) {
            return TsResult.None;
        }
        return TsResult.Some<IPath>(Path({ _string: `${__dirname}/${name.unwrap()}.${extension.unwrap()}` }));
    }

    function content(): TsResult.Result<Buffer, unknown> {
        if (!_exists()) {
            return TsResult.Err<string>("PathNotFound");
        }
        if (temporaryPath().none) {
            return TsResult.Err<string>("FailedToGenerateTemporaryPath");
        }
        const command: string = `bun hardhat flatten ${_.path().toString()} > ${temporaryPath().unwrap().toString()}`;
        ChildProcess.exec(command);
        const beginTimestamp: number = Date.now();
        let nowTimestamp: number = beginTimestamp;
        while (nowTimestamp - beginTimestamp < 2000) {
            nowTimestamp = Date.now();
        }
        const temporaryFile: IFile = File(temporaryPath().unwrap());
        const content: TsResult.Result<Buffer, unknown> = temporaryFile.content();
        if (!content.err) {
            return content;
        }
        const result: Buffer = content.unwrap();
        const temporaryFileRemoval: TsResult.Result<void, unknown> = temporaryFile.remove();
        if (temporaryFileRemoval.err) {
            console.error(`SolFile: failed to clean up ${temporaryFile.path().toString()} whilst compiling ${_.path().toString()}`);
        }
        return TsResult.Ok<Buffer>(result);
    }

    function output(): TsResult.Result<ISolcCompilationOutput, unknown> {
        if (!_exists()) {
            return TsResult.Err<string>("PathNotFound");
        }
        if (_.name().none) {
            return TsResult.Err<string>("UnableToParseName");
        }
        if (content().err) {
            return TsResult.Err<string>(content().toString());
        }
        return new TsResult.Ok<ISolcCompilationOutput>(JSON.parse(Solc.compile(JSON.stringify({
            language: "Solidity",
            sources: {[_.name().unwrap()]: {
                content: content().unwrap().toString("utf8")
            }},
            settings: {outputSelection: {"*": {"*": [
                "abi",
                "evm.bytecode",
                "evm.methodIdentifiers"
            ]}}}
        }))));
    }

    function errors(): TsResult.Result<string[], unknown> {
        if (!_exists()) {
            return TsResult.Err<string>("PathNotFound");
        }
        const result: string[] = [];
        if (output().err) {
            return TsResult.Err<string>(output().toString());
        }
        output().unwrap().errors.forEach(errorOrWarning => {
            if (errorOrWarning.severity !== "error") {
                return;
            }
            result.push(errorOrWarning.formattedMessage);
        });
        return TsResult.Ok<string[]>(result);
    }

    function warnings(): TsResult.Result<string[], unknown> {
        if (!_exists()) {
            return TsResult.Err<string>("PathNotFound");
        }
        const result: string[] = [];
        if (output().err) {
            return TsResult.Err<string>(output().toString());
        }
        output().unwrap().errors.forEach(errorOrWarning => {
            if (errorOrWarning.severity === "error") {
                return;
            }
            result.push(errorOrWarning.formattedMessage);
        });
        return TsResult.Ok<string[]>(result);
    }

    function bytecode(): TsResult.Result<string, unknown> {
        if (!_exists()) {
            return TsResult.Err<string>("PathNotFound");
        }
        if (_.name().none) {
            return TsResult.Err<string>("UnableToParseName");
        }
        if (errors().err) {
            return TsResult.Err<string>(errors().toString());
        }
        if (errors().unwrap().length !== 0) {
            return TsResult.Err<string>("InvalidSourceCode");
        }
        if (output().err) {
            return TsResult.Err<string>(output().toString());
        }
        const result: string
            = output().unwrap()
                ?.contracts
                ?.[_.name().unwrap()]
                ?.[_.name().unwrap()]
                ?.evm
                ?.bytecode
                ?.object ?? "";
        if (result === "") {
            return TsResult.Err<string>("InvalidBytecode");
        }
        return TsResult.Ok<string>(result);
    }

    function abi(): TsResult.Result<object[], unknown> {
        if (!_exists()) {
            return TsResult.Err<string>("PathNotFound");
        }
        if (_.name().none) {
            return TsResult.Err<string>("UnableToParseName");
        }
        if (errors().err) {
            return TsResult.Err<string>(errors().toString());
        }
        if (errors().unwrap().length !== 0) {
            return TsResult.Err<string>("SourceCodeIssue");
        }
        if (output().err) {
            return TsResult.Err<string>(output().toString());
        }
        return TsResult.Ok<object[]>(
            output().unwrap()
                ?.contracts
                ?.[_.name().unwrap()]
                ?.[_.name().unwrap()]
                ?.abi
        );
    }

    function methods(): TsResult.Result<object, unknown> {
        if (!_exists()) {
            return TsResult.Err<string>("PathNotFound");
        }
        if (_.name().none) {
            return TsResult.Err<string>("UnableToParseName");
        }
        if (errors().err) {
            return TsResult.Err<string>(errors().toString());
        }
        if (errors().unwrap().length !== 0) {
            return TsResult.Err<string>("SourceCodeIssue");
        }
        if (output().err) {
            return TsResult.Err<string>(output().toString());
        }
        return TsResult.Ok<object>(
            output().unwrap()
                ?.contracts
                ?.[_.name().unwrap()]
                ?.[_.name().unwrap()]
                ?.evm
                ?.methodIdentifiers
        );
    }

    function _exists(): boolean {
        return _.path().exists().unwrapOr(false);
    }

    return TsResult.Ok<ISolFile>(_);
}