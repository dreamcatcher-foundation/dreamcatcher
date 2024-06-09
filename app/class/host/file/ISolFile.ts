import { type IFile } from "./IFile.ts";
import { type IPath } from "../IPath.ts";
import { type ISolcCompilationOutput } from "./solc/ISolcCompilationOutput.ts";
import * as TsResult from "ts-results";

export interface ISolFile extends IFile {
    temporaryPath(): TsResult.Option<IPath>;
    content(): TsResult.Result<Buffer, unknown>;
    output(): TsResult.Result<ISolcCompilationOutput, unknown>;
    errors(): TsResult.Result<string[], unknown>;
    warnings(): TsResult.Result<string[], unknown>;
    bytecode(): TsResult.Result<string, unknown>;
    abi(): TsResult.Result<object[] | string[], unknown>;
    methods(): TsResult.Result<object, unknown>;
}