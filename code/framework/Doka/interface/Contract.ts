import { exec } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import * as solc from "solc";

export namespace ContractLib {
    export interface ContractPayload {
        path: string;
        outDirFlat: string;
        outDirABI: string;
        outDirBytecode: string;
        outDirSelectors: string;
    }

    export function waitFor10Seconds(): boolean {
        let ms = 10 * 1000;
        let st = new Date().getTime();
        while(new Date().getTime() < st + ms);
        return true;
    }

    export function extractContractName(path: string): string {
        const name = path.split("/").at(-1)?.split(".").at(0);
        if (!name) {
            throw new Error("Doka: failed to parse contract name from path");
        }
        return name;
    }

    export function executeHardhatFlattenCommand(pathIn: string, pathOut: string): boolean {
        exec(`bun hardhat flatten ${pathIn} > ${pathOut}`);
        return true;
    }

    export function generateCompilerInput(contractName: string, contractSourceCode: string) {
        return {
            "language": "Solidity",
            "sources": {
                [contractName]: {
                    "content": contractSourceCode
                }
            },
            "settings": {
                "outputSelection": {
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

    export function compile(input: any) {
        return JSON.parse(solc.compile(JSON.stringify(input)));
    }
}

export function Contract(payload: ContractLib.ContractPayload) {
    const contractName: string = ContractLib.extractContractName(payload.path);
    const path: string = `${payload.outDirFlat}/${contractName}.sol`;
    ContractLib.executeHardhatFlattenCommand(payload.path, path);
    ContractLib.waitFor10Seconds();
    const contractSourceCode: string = readFileSync(path, "utf-8");
    const compilerInput = ContractLib.generateCompilerInput(contractName, contractSourceCode);
    const compiledContractSourceCode = ContractLib.compile(compilerInput);
    const content = compiledContractSourceCode["contracts"][contractName][contractName];
    writeFileSync(`${payload.outDirABI}/${contractName}.json`, JSON.stringify(abi()));
    writeFileSync(`${payload.outDirBytecode}/${contractName}.json`, JSON.stringify(bytecode()));
    writeFileSync(`${payload.outDirSelectors}/${contractName}.json`, JSON.stringify(selectors()));

    function abi() {
        return content.abi;
    }

    function bytecode() {
        return content.evm.bytecode.object;
    }

    function selectors() {
        return content.evm.methodIdentifiers;
    }

    function errorsAndWarnings(): object | "Doka: no errors or warnings" {
        if (compiledContractSourceCode.errors) {
            return compiledContractSourceCode.errors;
        }
        return "Doka: no errors or warnings";
    }
    
    return {
        contractName,
        abi,
        bytecode,
        selectors,
        errorsAndWarnings
    }
}