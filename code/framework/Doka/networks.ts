import { JsonRpcProvider, Wallet } from 'ethers';
import { config } from './dokaConfig.ts';

export const networks = (function() {
    let instance: {
        network: typeof network,
        account: typeof account
    };
    let __nameToNetwork: Map<string, JsonRpcProvider> = new Map();
    let __nameToAccount: Map<string, Wallet> = new Map();

    for (let i = 0; i < config['networks'].length; i++) {
        const network = config['networks'][i];
        __nameToNetwork.set(network['name'], new JsonRpcProvider(network['rpcUrl']));
        __nameToAccount.set(network['name'], new Wallet(network['wallets'][0]!, __nameToNetwork.get(network['name'])));
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