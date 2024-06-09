import { type ISolcCompilationErrorOrWarning } from "./ISolcCompilationErrorOrWarning.ts";

export interface ISolcCompilationOutput {
    errors: ISolcCompilationErrorOrWarning[];
    contracts: {[contractName: string]: {[contractName: string]: {
        abi:
        | object[]
        | string[];
        evm: {
            methodIdentifiers: object;
            bytecode: {
                object: string;
            };
        };
    }}}
}