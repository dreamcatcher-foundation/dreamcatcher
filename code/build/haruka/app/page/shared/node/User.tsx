import {BrowserProvider, Contract, ContractFactory} from "ethers";

interface User {
    hasMetamask: () => boolean;

    invoke: (address: string, abstractBinaryInterface: object[], method: string, ...args: any[]) => Promise<any>;

    deploy: (abstractBinaryInterface: object[], bytecode: string, ...args: any[]) => Promise<any>;
}

export let user = (function() {
    let instance: User;

    function hasMetamask(): boolean {
        return !!_metamask();
    }

    async function invoke(address: string, abstractBinaryInterface: object[], method: string, ...args: any[]): Promise<any> {
        return new Promise(function(resolve, reject) {
            if (!hasMetamask()) {
                return reject("User: metamask is not installed");
            }
            let provider: BrowserProvider = new BrowserProvider(_metamask());
            let contract: Contract = new Contract(address, abstractBinaryInterface, provider);
            return contract.getFunction(method)(...args).then(response => resolve(response));
        });
    }

    async function deploy(abstractBinaryInterface: object[], bytecode: string, ...args: any[]): Promise<any> {
        return new Promise(function(resolve, reject) {
            if (!hasMetamask()) {
                return reject("");
            }
            let provider: BrowserProvider = new BrowserProvider(_metamask());
            return new ContractFactory(abstractBinaryInterface, bytecode, provider).deploy(...args).then(contract => resolve(contract));
        });
    }

    function _metamask(): any {
        let windowAsAny: any = window as any;
        let metamask: any = windowAsAny.ethereum;
        return metamask;
    }

    return function() {
        return !instance ? instance = {hasMetamask, invoke, deploy} : instance;
    }
})();