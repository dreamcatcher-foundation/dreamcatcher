import {Contract} from "ethers";
import {BrowserProvider} from "ethers";

class ClientContractGateway {
    
}

export type ClientContractGateway = ReturnType<typeof ClientContractGateway>;

export function ClientContractGateway(_address: string, _abi: object[]) {
    const _contract: Contract = (function() {
        const windowAsAny: any = window as any;
        const metamask: any = windowAsAny.ethereum;
        const provider: BrowserProvider = new BrowserProvider(metamask);
        return new Contract(_address, _abi, provider);
    })();

    async function call(method: string, ...args: unknown[]): Promise<unknown> {
        return await _contract.getFunction(method)(...args);
    }

    return ({
        call
    });
}