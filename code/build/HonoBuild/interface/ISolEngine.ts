import {JsonRpcProvider, Wallet, ContractFactory, BaseContract, ContractTransactionResponse, Contract} from "ethers";
import {ISolCompilationMaterial} from "../material/ISolCompilationMaterial.ts";

export default interface ISolEngine {
    networks: () => {[networkName: string]: JsonRpcProvider | undefined};
    accounts: () => {[networkName: string]: Wallet | undefined};
    material: () => {[contractName: string]: ISolCompilationMaterial | undefined};
    contract: (networkId: string, contractName: string, address: string) => Contract | undefined;
    factory: (networkId: string, contractName: string) =>  ContractFactory | undefined;
    deploy: (networkId: string, contractName: string, ...args: any[]) => Promise<BaseContract & {deploymentTransaction(): ContractTransactionResponse;} & Omit<BaseContract, keyof BaseContract> | undefined>;
}