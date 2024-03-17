import * as FileSystem from "fs";
import * as Path from "path";
import * as ChildProcess from "child_process";
import * as Solc from "solc"; // => This is ok.
import * as Ethers from "ethers";
import moize from "moize";

// => Path finder function removed because of time constraints.

export type IConfig = {
    contracts: ({
        name: string;
        path: string;
    })[];
    fSrcDir: string;
    networks: ({
        name: string;
        rpcUrl: string;
        privateKey: string
    })[];
    app: (engine: IEngine) => boolean;
    silence: boolean;
};

export type ICompiledContractMaterial = ReturnType<typeof CompiledContractMaterial>;

function CompiledContractMaterial(name: string, path: string, fSrcDir: string) {
    let ABI_: object[] = [];
    let bytecode_: string = "";
    let warnings_: object[] = [];
    let errors_: object[] = [];

    {  
        const content: any = compile_(path, fSrcDir, name);

        if (content["errors"]) {
            warnings_ = content["errors"];

            for (let i = 0; i < warnings_.length; i++) {
                const warning: any = warnings_[i];

                if (warning["severity"] == "error") {
                    errors_.push(warnings_.splice(i, 1));
                }
            }

            if (errors_.length != 0) {
                for (let i = 0; i < errors_.length; i++) {
                    const error: any = errors_[i];
                    const message = error[i]["formattedMessage"];
                    console.error(message);
                }

                throw "Serenity: .sol error";
            }
        }

        ABI_ = content["contracts"][name][name]["abi"];
        bytecode_ = content["contracts"][name][name]["evm"]["bytecode"]["object"];
    }

    function ABI(): object[] {
        return ABI_;
    }

    function bytecode(): string {
        return bytecode_;
    }

    function warnings(): object[] {
        return warnings_;
    }

    function errors(): object[] {
        return errors_;
    }

    function compile_(path: string, fSrcDir: string, name: string): object {
        flatten_(name, path, fSrcDir);

        // => Sync exec does not work due to this version of node
        //    being incompatible with hardhat.
        //
        // => One of the downsides of using Bun with hardhat.
        //
        // => 0.5 seconds is the sweet spot.
        delay_(500n);
        return JSON.parse(Solc.compile(JSON.stringify(payload_(name, sourcecode_(fSrcPath_(name, fSrcDir))))));
    }

    function payload_(name: string, sourcecode: string) {
        return {"language": "Solidity", "sources": {[name]: {"content": sourcecode}}, "settings": {"outputSelection": {"*": {"*": ["abi", "evm.bytecode", "evm.methodIdentifiers"]}}}} as const; 
    }

    function sourcecode_(fSrcPath: string): string {
        return FileSystem.readFileSync(fSrcPath, "utf8");
    }

    function delay_(ms: bigint): boolean {
        const timestamp: bigint = BigInt(new Date().getTime());
        while (BigInt(new Date().getTime()) < (timestamp + ms));
        return true;
    }

    function flatten_(name: string, pathIn: string, pathOut: string): boolean {
        ChildProcess.exec(`bun hardhat flatten ${pathIn} > ${pathOut}/${name}.sol`);
        return true;
    }

    function fSrcPath_(name: string, fSrcDir: string) {
        return `${fSrcDir}/${name}.sol`;
    }

    return {
        ABI,
        bytecode,
        warnings,
        errors
    }
}

export type IEngine = ReturnType<typeof Engine>;

function Engine(
    networks: {[k: string]: undefined | Ethers.JsonRpcProvider},
    accounts: {[k: string]: undefined | Ethers.Wallet},
    material: {[k: string]: undefined | ICompiledContractMaterial}
) {
    type IContractFactory = Ethers.ethers.ContractFactory<any[], Ethers.ethers.BaseContract>;

    function createFactory(networkid: string, blueprint: string): IContractFactory {
        onlyIfAvailable_(networkid, blueprint);
        return new Ethers.ContractFactory(
            material[blueprint]!.ABI(),
            material[blueprint]!.bytecode(),
            accounts[networkid]
        );
    }

    function createContract(networkid: string, blueprint: string, address: string): Ethers.Contract {
        onlyIfAvailable_(networkid, blueprint);
        return new Ethers.Contract(address, material[blueprint]!.ABI(), networks[networkid]);
    }

    async function deploy(networkid: string, blueprint: string, ...args: any[]) {
        onlyIfAvailable_(networkid, blueprint);
        return await createFactory(networkid, blueprint).deploy(...args);
    }

    function onlyIfAvailable_(networkid: string, blueprint: string): boolean {
        onlyIfNetworkAvailable_(networkid);
        if (!material[blueprint]?.ABI()) throw new Error("Engine: missing ABI");
        if (!material[blueprint]?.bytecode()) throw new Error("Engine: missing bytecode");
        return true;
    }

    function onlyIfNetworkAvailable_(networkid: string): boolean {
        if (!accounts[networkid]) throw new Error("Engine: missing account or incorrect network Id");
        return true;
    }

    return {
        createFactory,
        createContract,
        deploy
    }
}

export async function main(config: IConfig) {
    onlyIfConfig_(config);
    log_(config, "loading");

    const networks: {[k: string]: undefined | Ethers.JsonRpcProvider} = {};
    const accounts: {[k: string]: undefined | Ethers.Wallet} = {};
    const material: {[k: string]: undefined | ICompiledContractMaterial} = {};

    {
        for (let i = 0; i < config.networks.length; i++) {
            const network = config.networks[i];

            log_(config, "loading ${network.name} network");

            networks[network.name] = new Ethers.JsonRpcProvider(network.rpcUrl);
            accounts[network.name] = new Ethers.Wallet(network.privateKey, networks[network.name]);
        }

        log_(config, "compiling .sol contracts");

        for (let i = 0; i < config.contracts.length; i++) {
            const contract = CompiledContractMaterial(
                config.contracts[i].name,
                config.contracts[i].path,
                config.fSrcDir
            );
            material[config.contracts[i].name] = contract;

            log_(config, `successfull compilation: ${config.contracts[i].name}`);
        }
    }

    return config.app(
        Engine(
            networks,
            accounts,
            material
        )
    );

    function log_(config: IConfig, message: string) {
        if (!config.silence) console.log(message);
    }

    function onlyIfConfig_(config: IConfig) {
        if (!config) throw new Error("missing config");
        return true;
    }
} 