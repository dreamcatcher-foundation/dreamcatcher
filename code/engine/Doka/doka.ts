import { networks } from './networks.ts';
import { contracts } from './contracts.ts';
import { ContractFactory, Contract } from 'ethers';
import { DeployedContract } from './deployedContract.ts';

export const doka = (function() {
    let instance: {
        buildInterface: typeof buildInterface,
        deployContractAndBuildInterface: typeof deployContractAndBuildInterface,
        buildFactory: typeof buildFactory,
        call: typeof call,
        deploy: typeof deploy
    };

    function buildInterface(networkId: string, address: string, abi: any) {
        return new Contract(address, abi, networks().network(networkId));
    }

    function deployContractAndBuildInterface(networkId: string, blueprint: string, ...args: any[]) {
        return DeployedContract(networkId, blueprint, ...args);
    }

    function buildFactory(networkId: string, blueprint: string) {
        return new ContractFactory(contracts().abi(blueprint), contracts().bytecode(blueprint), networks().account(networkId));
    }

    async function call(networkId: string, address: string, abi: any, method: string, ...args: any[]) {
        return await new Contract(address, abi, networks().account(networkId))[method](...args);
    }

    async function deploy(networkId: string, blueprint: string, ...args: any[]) {
        return await buildFactory(networkId, blueprint).deploy(...args);
    }

    return function() {
        if (!instance) {
            return instance = {
                buildInterface,
                deployContractAndBuildInterface,
                buildFactory,
                call,
                deploy
            }
        }
        return instance;
    }
})();