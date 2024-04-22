import {busySleep} from "./TimerLib.ts";
import {exec} from "child_process";



interface CompiledContractStruct {
    abi?: object[];
    bytecode?: string;
    warnings?: object[];
    errors?: object[];
}

export function compileSOL(
    name: string, 
    path:string, 
    fSrcDir:string) {
    const fSrcPath: string = `${fSrcDir}/${name}.sol`;
    
}

function _compile(name: string, fSrcPath: string) {
    const solcIn = {
        language: "Solidity",
        sources: {
            [name]: {
                content: readFileSync(fSrcPath, "utf8")
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
    } as const;
}

function _execFlattenCommand(path0: string, path1: string) {
    exec(`bun hardhat flatten ${path0} > ${path1}`);
}