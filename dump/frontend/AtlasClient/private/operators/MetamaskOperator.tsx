import {on, broadcast} from "../connection/Connection.tsx";
import {network} from "../connection/Network.tsx";
import {BrowserProvider, Contract} from "ethers";

class metamask {
    private static _instance: metamask;
    public accounts?: any[];

    private constructor() {}

    public static get instance() {
        if (!metamask._instance) metamask._instance = new metamask();
        return metamask._instance;
    }

    public static get extension() {
        return (window as any).ethereum;
    }

    public static get hasExtension() {
        return metamask.extension ? true : false;
    }

    public static async connect() {
        if (!metamask.extension) return;
        try {

        }
    }
}


export function metamassk() {
    return (window as any).ethereum;
}

export async function accounts() {
    if (!metamask()) return [];
    try {
        const accounts: any[] = await metamask().request({method: "eth_requestAccounts"});
        if (!accounts) return [];
        return accounts;
    }
    catch {
        return [];
    }
}

export async function connect() {
    state
        .instance
        .accounts = await accounts();
}

export async function execute(address: string, ABI: string, method: string, ...args: any[]) {
    
}



const metamasks = (function() {
    let instance: IMetamask;
    let _accounts: any[];
    let _connected: boolean;

    function connected() {
        return _connected;
    }

    function metamask() {
        return (window as any).ethereum;
    }

    async function accounts() {
        if (!metamask()) return [];
        try {
            const accounts: any[] = await metamask().request({method: "eth_requestAccounts"});
            if (!accounts) return [];
            return accounts;
        }
        catch {
            return [];
        }
    }

    async function response(address: string, ABI: string, method: string, ...args: any[]) {
        if (!connected()) return broadcast(network(), "not-connected");
        try {
            const provider = new BrowserProvider(metamask());
            provider._detectNetwork()
            const signer = await provider.getSigner();
            const contract = new Contract(address, ABI, signer);
            return await contract.getFunction(method)(...args);
        }
        catch {
            return broadcast(network(), "failed-response");
        }
    }



    return function() {
        if (!instance) instance = {
            connect,
            execute
        };
        return instance;
    }
})();