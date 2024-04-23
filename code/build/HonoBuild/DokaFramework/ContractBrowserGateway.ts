import type {Maybe} from "./ErrorHandlerLib.ts";
import {BrowserProvider} from "ethers";
import {JsonRpcProvider} from "ethers";
import {Wallet} from "ethers";
import {Contract} from "ethers";
import {wrap} from "./ErrorHandlerLib.ts";



export function ContractGateway() {

}

export function SignedContractGateway() {

}


export function readAndWriteToContractWithClientMetamask(address: string, abi: object[], method: string, ...args: unknown[]): Maybe<Promise<unknown>> {
    return wrap<Promise<unknown>>(async function() {
        const windowAsAny: any = window as any;
        const metamask: any = windowAsAny.ethereum;
        const provider: BrowserProvider = new BrowserProvider(metamask);
        const contract: Contract = new Contract(address, abi, provider);
        return await contract.getFunction(method)(...args);
    });
}

export async function readFromContractWithJsonRpcProvider(address: string, abi: object[], url: string, method: string, ...args: unknown[]): Promise<unknown> {
    const provider: JsonRpcProvider = new JsonRpcProvider(url);
    const contract: Contract = new Contract(address, abi, provider);
    return await contract.getFunction(method)(...args);
}

export async function readAndWriteToContractWithSignedJsonRpcProvider(address: string, abi: object[], url: string, key: string, method: string, ...args: unknown[]): Promise<unknown> {
    const provider: JsonRpcProvider = new JsonRpcProvider(url);
    const signer: Wallet = new Wallet(key, provider);
    const contract: Contract = new Contract(address, abi, signer);
    return await contract.getFunction(method)(...args);
}

export async function deployContractWithClientMetamask(abi: )