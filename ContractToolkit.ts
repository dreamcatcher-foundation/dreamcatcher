import * as solc from 'solc';
import Web3 from 'web3';
import {resolve} from 'path';
import {readFileSync} from 'fs';

interface Contract {
    applicationBinaryInterface: () => object[];
    assembly: () => string;
    methodIdentifiers: () => object;
    bytecode: () => string;
    bytecodeOpcodes: () => string;
    bytecodeSourceMap: () => string;
    deployedBytecode: () => string;
    deployedBytecodeOpcodes: () => string;
    deployedBytecodeSourceMap: () => string;
    storageLayout: () => object[];
    storageLayoutTypes: () => object[];
    call: (methodSignature: string, ...args: any[]) => Promise<any>;
}

function Contract(filename: string, rpcUrl: string, address?: string) {
    let instance: Contract;

    return function() {
        interface Memory {
            applicationBinaryInterface: object[];
            assembly: string;
            methodIdentifiers: object;
            bytecode: string;
            bytecodeOpcodes: string;
            bytecodeSourceMap: string;
            deployedBytecode: string;
            deployedBytecodeOpcodes: string;
            deployedBytecodeSourceMap: string;
            storageLayout: object[];
            storageLayoutTypes: object[];
            address: string;
            web3: any;
            contract: any;
        }

        const memory = (function() {
            let instance: Memory;
            let applicationBinaryInterface: object[] = [];
            let assembly: string = '';
            let methodIdentifiers: object = {};
            let bytecode: string = '';
            let bytecodeOpcodes: string = '';
            let bytecodeSourceMap: string = '';
            let deployedBytecode: string = '';
            let deployedBytecodeOpcodes: string = '';
            let deployedBytecodeSourceMap: string = '';
            let storageLayout: object[] = [];
            let storageLayoutTypes: object[] = [];
            let address: string = '';
            let web3: any = '';
            let contract: any = '';

            return function() {
                if (!instance) {
                    return instance = {
                        applicationBinaryInterface,
                        assembly,
                        methodIdentifiers,
                        bytecode,
                        bytecodeOpcodes,
                        bytecodeSourceMap,
                        deployedBytecode,
                        deployedBytecodeOpcodes,
                        deployedBytecodeSourceMap,
                        storageLayout,
                        storageLayoutTypes,
                        address,
                        web3,
                        contract
                    };
                }
                return instance;
            }
        })();

        interface Compiler {
            compile: (filename: string) => readonly [object[], string, object, string, string, string, string, string, string, object[], object[]];
        }

        const compiler = (function() {
            let instance: Compiler;

            function compile(filename: string): readonly [object[], string, object, string, string, string, string, string, string, object[], object[]] {
                const content: any = JSON.parse((solc as any).compile(JSON.stringify({
                    language: 'Solidity',
                    sources: {
                        filename: {
                            content: readFileSync(resolve(__dirname, `${filename}.sol`), 'utf8')
                        }
                    },
                    settings: {
                        outputSelection: {
                            '*': {
                                '*': ['*']
                            }
                        }
                    }
                })));
                return [
                    content['contracts']['filename'][filename as string]['abi'] as object[],
                    content['contracts']['filename'][filename as string]['evm']['assembly'] as string,
                    content['contracts']['filename'][filename as string]['evm']['methodIdentifiers'] as object,
                    content['contracts']['filename'][filename as string]['evm']['bytecode']['object'] as string,
                    content['contracts']['filename'][filename as string]['evm']['bytecode']['opcodes'] as string,
                    content['contracts']['filename'][filename as string]['evm']['bytecode']['sourceMap'] as string,
                    content['contracts']['filename'][filename as string]['evm']['deployedBytecode']['object'] as string,
                    content['contracts']['filename'][filename as string]['evm']['deployedBytecode']['opcodes'] as string,
                    content['contracts']['filename'][filename as string]['evm']['deployedBytecode']['sourceMap'] as string,
                    content['contracts']['filename'][filename as string]['storageLayout']['storage'] as object[],
                    content['contracts']['filename'][filename as string]['storageLayout']['types'] as object[]
                ] as const;
            }

            function flatten(filename: string) {
                
            }

            return function() {
                if (!instance) {
                    return instance = {
                        compile
                    };
                }
                return instance;
            }
        })();

        const compiled = compiler().compile(filename);

        memory().applicationBinaryInterface = compiled[0];
        memory().assembly = compiled[1];
        memory().methodIdentifiers = compiled[2];
        memory().bytecode = compiled[3];
        memory().bytecodeOpcodes = compiled[4];
        memory().bytecodeSourceMap = compiled[5];
        memory().deployedBytecode = compiled[6];
        memory().deployedBytecodeOpcodes = compiled[7];
        memory().deployedBytecodeSourceMap = compiled[8];
        memory().storageLayout = compiled[9];
        memory().storageLayoutTypes = compiled[10];

        if (address) {
            memory().address = address;
            memory().web3 = new Web3(rpcUrl);
            memory().contract = new (memory().web3.eth.Contract(applicationBinaryInterface(), address));
        }

        function applicationBinaryInterface(): object[] {
            return memory().applicationBinaryInterface;
        }

        function assembly(): string {
            return memory().assembly;
        }

        function methodIdentifiers(): object {
            return memory().methodIdentifiers;
        }
        
        function bytecode(): string {
            return memory().bytecode;
        }

        function bytecodeOpcodes(): string {
            return memory().bytecodeOpcodes;
        }

        function bytecodeSourceMap(): string {
            return memory().bytecodeSourceMap;
        }

        function deployedBytecode(): string {
            return memory().deployedBytecode;
        }

        function deployedBytecodeOpcodes(): string {
            return memory().deployedBytecodeOpcodes;
        }

        function deployedBytecodeSourceMap(): string {
            return memory().deployedBytecodeSourceMap;
        }

        function storageLayout(): object[] {
            return memory().storageLayout;
        }

        function storageLayoutTypes(): object[] {
            return memory().storageLayoutTypes;
        }

        async function call(methodSignature: string, ...args: any[]): Promise<any> {
            return await memory().contract.methods[methodSignature](args).call();
        }

        return instance = {
            applicationBinaryInterface,
            assembly,
            methodIdentifiers,
            bytecode,
            bytecodeOpcodes,
            bytecodeSourceMap,
            deployedBytecode,
            deployedBytecodeOpcodes,
            deployedBytecodeSourceMap,
            storageLayout,
            storageLayoutTypes,
            call
        };
    }();
}

const testPath = "code/contract/sol/solidstate/ERC20/Token.sol";








import {straighten} from "sol-straightener"




//const Straightener = require("sol-straightener");

async function main() {
    console.log(await straighten("code/contract/sol/solidstate/DREAM.sol"));
}

main();

// writeFileSync("code/contract/sol/solidstate/ERC20/Token.sol", response);