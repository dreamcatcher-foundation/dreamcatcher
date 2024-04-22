import {JsonRpcProvider, Contract as EthersContract, Wallet} from "ethers";

class Contract {
    private _address: string;
    private _abi: object[];
    private _url: string;
    private _key: string;

    public 
}


async function callWithJsonRpcProvider({
    address,
    abi,
    url,
    method,
    args}: {
    address: string;
    abi: object[];
    url: string;
    method: string;
    args?: unknown[];}): Promise<unknown> {
    const provider: JsonRpcProvider = new JsonRpcProvider(url);
    const contract: Contract = new Contract(address, abi, provider);
    return await contract.getFunction(method)(args ?? []);
}

async function callWithSigner({
    address,
    abi,
    url,
    key,
    method,
    args
}: {
    address: string;
    abi: object[];
    url: string;
    key: string;
    method: string;
    args?: unknown[];
}) {
    const provider: JsonRpcProvider = new JsonRpcProvider(url);
    const signer: Wallet = new Wallet(key, provider);
    const contract: Contract = new Contract(address, abi, signer);
    return await contract.getFunction(method)(args ?? []);
}