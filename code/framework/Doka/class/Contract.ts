import * as ChildProcess from "child_process";
import * as FileSystem from "fs";
import * as Solc from "solc";
import * as Ethers from "ethers";

const loader: Loader = {
    paths: {
        contracts: [],
        outDirFlat: "./code/contract/sol/dist/flat",
        outDirBytecode: "./code/contract/sol/dist/bytecode",
        outDirABI: "./code/contract/sol/dist/abi",
        outDirSelectors: "./code/contract/sol/dist/selectors"
    },
    networks: [{
        name: "polygon",
        rpcUrl: process.env.polygonRpcUrl!,
        privateKeys: [
            process.env.polygonPrivateKey!
        ]
    }, {
        name: "polygonTenderlyFork",
        rpcUrl: process.env.polygonTenderlyForkRpcUrl!,
        privateKeys: [
            process.env.polygonPrivateKey!
        ]
    }],
    silence: false
};

if (!loader.silence) {
    console.log("Doka: loading");
}

interface Network {
    name: string;
    rpcUrl: string;
    privateKeys: string[];
}

interface Loader {
    paths: {
        contracts: string[];
        outDirFlat: string;
        outDirBytecode: string;
        outDirABI: string;
        outDirSelectors: string;
    };
    networks: Network[];
    silence: boolean;
}

interface ContractLoader {
    path: string;
    outDirFlat: string;
    outDirABI: string;
    outDirBytecode: string;
    outDirSelectors: string;
}

function Contract(loader: ContractLoader) {
    let __name:  string;
    let __abi:   unknown;
    let __byt:   unknown;
    let __sel:   unknown;
    let __err:   object | "no errors or warnings";

    function __contructor(loader: ContractLoader) {
        const name: string | undefined = 
            loader
                .path
                .split("/")
                .at(-1)
                ?.split(".")
                .at(0);
        if (!name) {
            throw new Error("MissingContractName");
        }
        const fPath: string = `${loader.outDirFlat}/${name}.sol`;
        ChildProcess.execFileSync(`bun hardhat flatten ${loader.path} > ${fPath}`);
        const sourcecode: string = FileSystem.readFileSync(fPath, "utf-8");
        const input = {
            language: "Solidity",
            sources: {
                [name!]: {
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
        const output: object = JSON.parse(Solc.compile(JSON.stringify(input)));
        return {
            0: name,
            1: (output as any)["contracts"][name][name]["abi"],
            2: (output as any)["contracts"][name][name]["evm"]["bytecode"]["object"],
            3: (output as any)["contracts"][name][name]["evm"]["methodIdentifiers"],
            4: (output as any).errors ? (output as any).errors : "no errors or warnings"
        }
    }

    const constructorResponses = __contructor(loader);

    __name   = constructorResponses[0];
    __abi    = constructorResponses[1];
    __byt    = constructorResponses[2];
    __sel    = constructorResponses[3];
    __err    = constructorResponses[4];

    FileSystem.writeFileSync(`${loader.outDirABI}/${name}.json`, JSON.stringify(__abi));
    FileSystem.writeFileSync(`${loader.outDirBytecode}/${name}.json`, JSON.stringify(__byt));
    FileSystem.writeFileSync(`${loader.outDirSelectors}/${name}.json`, JSON.stringify(__sel));

    function name() {
        return __name;
    }

    function abi() {
        return __abi;
    }

    function byt() {
        return __byt;
    }

    function sel() {
        return __sel;
    }

    function err() {
        return __err;
    }

    return {
        name,
        abi,
        byt,
        sel,
        err
    }
}

const contracts = (function() {
    interface Self {
        get:         typeof get,
        abi:         typeof abi,
        bytecode:    typeof bytecode,
        selectors:   typeof selectors
    }

    let instance: Self;

    const __nameToContract: Map<string, ReturnType<typeof Contract>> = new Map();

    if (!loader.silence) {
        console.log("Doka: compiling contracts");
    }

    for (let i = 0; i < loader.paths.contracts.length; i++) {
        const contractLoader: ContractLoader = {
            path:                loader.paths.contracts[i],
            outDirFlat:          loader.paths.outDirFlat,
            outDirABI:           loader.paths.outDirABI,
            outDirBytecode:      loader.paths.outDirBytecode,
            outDirSelectors:     loader.paths.outDirSelectors
        }
        const contract = Contract(contractLoader);

        __nameToContract.set(contract.name(), contract);

        if (!loader.silence) {
            console.log(`Doka: compiled ${contract.name()}`);
        }
    }

    function get(blueprint: string) {
        return __nameToContract.get(blueprint);
    }

    function abi(blueprint: string) {
        return get(blueprint)?.abi();
    }

    function bytecode(blueprint: string) {
        return get(blueprint)?.byt();
    }

    function selectors(blueprint: string) {
        return get(blueprint)?.sel();
    }

    return function() {
        if (!instance) {
            return instance = {
                get,
                abi,
                bytecode,
                selectors
            }
        }
        return instance;
    }
})();

const networks = (function() {
    interface Self {
        network: typeof network;
        account: typeof account;
    }

    let instance: Self;

    let __nameToNetwork: Map<string, Ethers.JsonRpcProvider>     = new Map();
    let __nameToAccount: Map<string, Ethers.Wallet>              = new Map();

    if (!loader.silence) {
        console.log("Doka: loading networks");
    }

    for (let i = 0; i < loader.networks.length; i++) {
        const network = loader.networks[i];
        __nameToNetwork.set(network.name, new Ethers.JsonRpcProvider(network.rpcUrl));
        __nameToAccount.set(network.name, new Ethers.Wallet(network.privateKeys[0], __nameToNetwork.get(network.name)));
    }

    function network(networkId: string) {
        return __nameToNetwork.get(networkId);
    }

    function account(networkId: string) {
        return __nameToAccount.get(networkId);
    }

    return function() {
        if (!instance) {
            return instance = {
                network,
                account
            }
        }
        return instance;
    }
})();