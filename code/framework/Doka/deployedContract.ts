import { networks } from './networks.ts';
import { contracts } from './contracts.ts';
import { ContractFactory, ContractTransactionResponse } from 'ethers';

export function DeployedContract(networkId: string, blueprint: string, ...args: any[]) {
    const factory = new ContractFactory(contracts().abi(blueprint), contracts().bytecode(blueprint), networks().account(networkId));
    const contract = factory.deploy(...args);

    async function address() {
        return (await contract).getAddress();
    }

    async function call(method: string, ...args: any[]): Promise<{'type': 'call' | 'view', 'content': any}> {
        const response = await (await contract as any)[method](...args);
        if (response instanceof ContractTransactionResponse) {
            const receipt = await response.wait();
            return {
                'type': 'call',
                'content': receipt?.status
            }
        }
        return {
            'type': 'view',
            'content': response
        };
    }

    return {
        address,
        call
    }
}