import * as Solc from "solc";
import {
    $wrap,
    $assert,
    $execute,
    $read} from "../../Tenso/Tenso.ts";







namespace CompilerLib {
    export interface CompilerOperation {
        contractPath: string;
        temporaryDirPath: string;
    }

    export function compile(path: string, tempPath: string) {
        const name: string | undefined = 
        path
            .split("/")
            .at(-1)
            ?.split(".")
            .at(0);
        $assert(!!name, "CompilerLib: missing contract name");
        const fPath: string = `${tempPath}/${name}.sol`;
        $execute(`bun hardhat flatten ${path} > ${fPath}`);
        const compiled = JSON.parse(Solc.compile(JSON.stringify({
            language: "Solidity",
            sources: {
                [name!]: {
                    content: $read(fPath)
                }
            },
            settings: {
                outputSelection: {
                    "*": {
                        "*": [
                            "abi",
                            "evm.bytecode",
                            "evm.methodIdentifiers"
                        ]
                    }
                }
            }
        })));
        return {
            0: name,
            1: compiled["contracts"][name!][name!]["abi"],
            2: compiled["contracts"][name!][name!]["evm"]["bytecode"]["object"],
            3: compiled["contracts"][name!][name!]["evm"]["methodIdentifiers"],
            4: compiled["errors"] ? compiled["errors"] : "no errors or warnings"
        }
    }
}

