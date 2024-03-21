// SPDX-License-Identifier: UNLICENSED
import {
    ContractFactory,
    BaseContract,
    ContractTransactionResponse,
    Contract
} from "ethers";

export interface IHelperEngine {
    newFactory: (networkId: string, contractName: string) => ContractFactory | undefined;
    newContract: (networkId: string, contractName: string, address: string) => Contract | undefined;
    deployContract: (networkId: string, contractName: string, ...args: any[]) => Promise<BaseContract & {deploymentTransaction(): ContractTransactionResponse;} & Omit<BaseContract, keyof BaseContract> | undefined>;
}