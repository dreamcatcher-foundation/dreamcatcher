// SPDX-License-Identifier: UNLICENSED
import {BaseContract, Contract, ContractFactory, ContractTransactionResponse, JsonRpcProvider, Wallet} from "ethers";
import {type IReadonlySolCompilationMaterial} from "./interfaces/IReadonlySolCompilationMaterial.ts";
import {type IConfig} from "./interfaces/IConfig.ts";
import {type IEngine} from "./interfaces/IEngine.ts";
import {SolCompiler} from "./SolCompiler.ts";

export class Engine implements IEngine {
    private networks_: {[networkName: string]: JsonRpcProvider | undefined} = {};
    private accounts_: {[networkName: string]: Wallet | undefined} = {};
    private material_: {[contractName: string]: IReadonlySolCompilationMaterial | undefined} = {};

    public constructor(config: IConfig) {
        const networks = config.networks;
        for (let i = 0; i < networks.length; i++) {
            const network = networks[i];
            this.networks_[network.name] = new JsonRpcProvider(network.rpcUrl);
            this.accounts_[network.name] = new Wallet(network.privateKey, this.networks_[network.name]);
        }
        const contracts = config.contracts;
        for (let i = 0; i < contracts.length; i++) {
            const contract = contracts[i];
            const compiler = new SolCompiler({});
            compiler.compileAndCache(contract.name, contract.path, config.fSrcDir);
            const material = compiler.cache[contract.name];
            if (material && material.ok)
                this.material_[contract.name] = material;
        }
    }

    public get networks(): Readonly<{[networkName: string]: JsonRpcProvider | undefined}> {
        return this.networks_;
    }

    public get accounts(): Readonly<{[networkName: string]: Wallet | undefined}> {
        return this.accounts_;
    }

    public get material(): Readonly<{[contractName: string]: IReadonlySolCompilationMaterial | undefined}> {
        return this.material_;
    }

    public async deployContract(networkId: string, contractName: string, ...args: any[]): Promise<BaseContract & {deploymentTransaction(): ContractTransactionResponse;} & Omit<BaseContract, keyof BaseContract> | undefined> {
        const factory = this.newFactory(networkId, contractName);
        if (!factory)
            return undefined;
        return await factory.deploy(...args);
    }

    public newFactory(networkId: string, contractName: string): ContractFactory | undefined {
        const account = this.accounts[networkId];
        const material = this.material[contractName];
        if (!account || !material)
            return undefined;
        return new ContractFactory(material.abi, material.bytecode, account);
    }

    public newContract(networkId: string, contractName: string, address: string): Contract | undefined {
        const account = this.accounts[networkId];
        const material = this.material[contractName];
        if (!account || !material)
            return undefined;
        return new Contract(address, material.abi, account);
    }
}