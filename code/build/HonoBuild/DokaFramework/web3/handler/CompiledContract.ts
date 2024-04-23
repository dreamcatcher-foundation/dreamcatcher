import {exec} from "child_process";
import {readFileSync} from "fs";
import solc from "solc";
import {busySleep} from "../../TimerLib.ts";

let _tempDir: string = "";

export function setTempDir(dir: string): void {
    _tempDir = dir;
}

export type CompiledContract = ReturnType<typeof CompiledContract>;

export function CompiledContract(path: string) {
    const _ = (function() {
        let name: string = "";
        let path: string = "";
        let abi: object[] = [];
        let bytecode: string = "";
        let warnings: object[] | string[] = [];
        let errors: object[] | string[] = [];
        let ok: boolean = false;
        return ({
            name,
            path,
            abi,
            bytecode,
            warnings,
            errors,
            ok
        });
    })();

    (function() {
        _.path = path;
        _.name = (function() {
            let result: string | undefined = _
                .path
                .split("/")
                .pop() || ""
            result = result
                .split(".")
                .at(-2);
            if (!result) return "";
            return result;
        })();
        if (_.name == "") {
            _.abi = [];
            _.bytecode = "";
            _.warnings = [];
            _.errors = [];
            _.ok = false;
            return;
        }
        let tempPath: string = `${_tempDir}/${_.name}.sol`;
        let command: string = `bun hardhat flatten ${_.path} > ${tempPath}`;
        exec(command);
        busySleep(500n);
        let solcin = ({
            "language": "Solidity",
            "sources": ({
                [_.name]: ({
                    "content": readFileSync(tempPath, "utf8")
                })
            }),
            "settings": ({
                "outputSelection": ({
                    "*": ({
                        "*": ([
                            "abi",
                            "evm.bytecode",
                            "evm.methodIdentifiers"
                        ])
                    })
                })
            })
        }) as const;
        let solcinAsString: string = JSON.stringify(solcin);
        let solcoutAsString: string = solc.compile(solcinAsString);
        let solcout: any = JSON.parse(solcoutAsString);
        if (!solcout) {
            _.abi = [];
            _.bytecode = "";
            _.warnings = [];
            _.errors = [];
            _.ok = false;
            return;
        }
        if (!solcout.errors) {
            _.abi = solcout
                ?.contracts
                ?.[_.name]
                ?.[_.name]
                ?._.abi ?? [];
            _.bytecode = solcout
                ?.contracts
                ?.[_.name]
                ?.[_.name]
                ?.evm
                ?.bytecode
                ?.object ?? "";
            _.warnings = [];
            _.errors = [];
            _.ok = true;
            return;
        }
        let warnings: object[] | string[] = solcout.errors;
        let errors: any[] = [];
        for (let i = 0; i < warnings.length; i++) {
            let warning: any = warnings[i];
            if (warning.severity == "error") {
                let error: any = warnings.splice(i, 1);
                errors.push(error);
            }
            else {
                let formattedMessage: string = warning.formattedMessage;
                warnings[i] = formattedMessage;
            }
        }
        if (errors.length != 0) {
            for (let i = 0; i < errors.length; i++) {
                let error: any = errors[i][0];
                let formattedMessage: string = error.formattedMessage;
                errors[i] = formattedMessage;
            }
            _.abi = [];
            _.bytecode = "";
            _.warnings = warnings;
            _.errors = errors;
            _.ok = false;
            return;
        }
        _.abi = solcout
            ?.contracts
            ?.[_.name]
            ?.[_.name]
            ?.abi ?? [];
        _.bytecode = solcout
            ?.contracts
            ?.[_.name]
            ?.[_.name]
            ?.evm
            ?.bytecode
            ?.object ?? "";
        _.warnings = warnings;
        _.errors = [];
        _.ok = true;
        return;
    })();

    function abi(): object[] {
        return _.abi;
    }

    function bytecode(): string {
        return _.bytecode;
    }

    function warnings(): string[] {
        return _.warnings as string[];
    }

    function errors(): string[] {
        return _.errors as string[];
    }
    
    function ok(): boolean {
        return _.ok;
    }

    function printWarnings(): void {
        let warningsLength: number = warnings().length;
        for (let i = 0; i < warningsLength; i++) {
            let warning: string = warnings()[i];
            console.warn(warning);
        }
    }

    function printErrors(): void {
        let errorsLength: number = errors().length;
        for (let i = 0; i < errorsLength; i++) {
            let error: string = errors()[i];
            console.error(error);
        }
    }

    return ({
        abi,
        bytecode,
        warnings,
        errors,
        ok,
        printWarnings,
        printErrors
    });
}