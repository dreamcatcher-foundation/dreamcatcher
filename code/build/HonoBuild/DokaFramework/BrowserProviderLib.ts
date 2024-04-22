import {BrowserProvider, Contract} from "ethers";


const metamask = (function() {

})();


export interface MetamaskCallPayloadStruct {
    address: string;
    abi: object[];
    method: string;
    args?: unknown[];
}

export async function callWithMetamaskSigner(payload: MetamaskCallPayloadStruct): Promise<unknown | "missing metamask"> {
    const {address, abi, method, args} = payload;
    const windowAsAny: any = window as any;
    const ethereum: any = windowAsAny.ethereum;
    if (!ethereum) return "missing metamask";
    const provider: BrowserProvider = new BrowserProvider(ethereum);
    const contract: Contract = new Contract(address, abi, provider);
    const response: any = await contract.getFunction(method)(args);
    return response as unknown;
}













const payload: MetamaskCallPayloadStruct = ({
    address: "",
    abi: [],
    method: "",
    args: []
});

callWithMetamaskSigner(payload);