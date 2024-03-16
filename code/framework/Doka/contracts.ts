import { config } from './dokaConfig.ts';
import { Contract } from './contract.ts';

export const contracts = (function() {
    console.log('Doka: is parsing contracts');

    let instance: {
        get: typeof get,
        abi: typeof abi,
        bytecode: typeof bytecode,
        selectors: typeof selectors
    };
    let __nameToContract: Map<string, ReturnType<typeof Contract>> = new Map();

    for (let i = 0; i < config['path']['contracts'].length; i++) {
        const contract = Contract(
            config['path']['contracts'][i],
            config['path']['outDirFlat'],
            config['path']['outDirABI'],
            config['path']['outDirBytecode'],
            config['path']['outDirSelectors']
        );
        __nameToContract.set(contract.name()!, contract);
        console.log(`Doka: parsed ${contract.name()}`);
    }

    function get(blueprint: string) {
        return __nameToContract.get(blueprint);
    }

    function abi(blueprint: string) {
        return get(blueprint)?.abi();
    }

    function bytecode(blueprint: string) {
        return get(blueprint)?.bytecode();
    }

    function selectors(blueprint: string) {
        return get(blueprint)?.selectors();
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