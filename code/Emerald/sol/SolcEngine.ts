import * as solc from "solc";
import * as fs from "fs";
import * as path from "path";

type TrustMeBro = any;

const solcAsTrustMeBro: TrustMeBro = (solc as TrustMeBro);

function compile(filename: string, contract: string): TrustMeBro[] {
    const result: TrustMeBro = output();

    if (result.errors) {
        console.error(result.errors);
        return [];
    }

    return [...stripAndParseIntoUsefulContent()];

    function stripAndParseIntoUsefulContent() {
        const root: TrustMeBro = result['contracts']['filename'][`${contract}`];
        return [
            root['abi'],
            root['evm']['assembly'],
            root['evm']['methodIdentifiers'],
            root['evm']['bytecode']['object'],
            root['evm']['bytecode']['opcodes'],
            root['evm']['bytecode']['sourceMap'],
            root['evm']['deployedBytecode']['object'],
            root['evm']['deployedBytecode']['opcodes'],
            root['evm']['deployedBytecode']['sourceMap'],
            root['storageLayout']['storage'],
            root['storageLayout']['types']
        ] as const;
    }

    function output(): TrustMeBro {
        const stringifiedInput: string = JSON.stringify(input());
        const rawOutput: TrustMeBro = solcAsTrustMeBro.compile(stringifiedInput);
        const output: TrustMeBro = JSON.parse(rawOutput);
        return output;
    }

    function input() {
        return {
            language: 'Solidity',
            sources: {
                filename: {
                    content: contractSource()
                }
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['*']
                    }
                }
            }
        } as const;
    }

    function contractSource(): Buffer | string {
        return fs.readFileSync(contractPath(), "utf8");
    }

    function contractPath(): string {
        return path.resolve(__dirname, filename);
    }
}

function abi(filename: string, contract: string): TrustMeBro {
    return compile(filename, contract)[0];
}

function assembly(filename: string, contract: string): TrustMeBro {
    return compile(filename, contract)[1];
}

console.log(compile("cheese.sol", "Joe"));