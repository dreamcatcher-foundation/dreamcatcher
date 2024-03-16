import * as ChildProcess from "child_process";
import * as FileSystem from "fs";
import * as Solc from "solc";

export interface Network {
    name: string;
    rpcUrl: string;
    privateKeys: string[];
};

export interface LoaderPayload {
    paths: {
        contracts: string[];
        outDirFlat: string;
        outDirBytecode: string;
        outDirABI: string;
        outDirSelectors: string;
    },
    networks: Network[]
};

export interface Contract {
    ABI: unknown;
    bytecode: unknown;
    selectors: unknown;
    errorsAndWarnings: object | "Doka: no errors or warnings";
}

namespace ContractLib {
    export interface Loader {
        path: string;
        outDirFlat: string;
        outDirABI: string;
        outDirBytecode: string;
        outDirSelectors: string;
    }

    export function Contract(loader: Loader) {


        const response = __constructor(loader);

        function __constructor(loader: Loader) {
            __ifMissingContractName(__name(loader.path));
            const fPath: string = `${loader.outDirFlat}/${__name(loader.path)}`;
            __executeHardhatFlattenCommand(loader.path, fPath);
            __delay10Seconds();
            const content = __compile(__input(__name(loader.path)!, __sourcecode(fPath)));


        }

        function __ifMissingContractName(name: string | undefined): boolean {
            if (!name) {
                throw new Error("Doka: MissingContractName");
            }
            return true;
        }

        function __delay10Seconds(): boolean {
            let ms = 10 * 1000;
            let st = new Date().getTime();
            while(new Date().getTime() < st + ms);
            return true;
        }

        function __name(path: string): string | undefined {
            return path.split("/").at(-1)?.split(".").at(0);
        }

        function __sourcecode(fPath: string): string {
            return FileSystem.readFileSync(fPath, "utf8");
        }

        function __executeHardhatFlattenCommand(path0: string, path1: string): boolean {
            ChildProcess.exec(`bun hardhat flatten ${path0} > ${path1}`);
            return true;
        }

        function __input(name: string, sourcecode: string) {
            return {
                language: "Solidity",
                sources: {
                    [name]: {
                        content: sourcecode
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

        function __compile(input: any) {
            const inputAsStringJSON: string = JSON.stringify(input);
            const rawCompiledContent = Solc.compile(inputAsStringJSON);
            const compiledContent: object = JSON.parse(rawCompiledContent);
            return compiledContent;
        }
    }
}

namespace ConstructorLib {
    export interface ContractConstructorPayload {}

    export function Contract() {

    }
}