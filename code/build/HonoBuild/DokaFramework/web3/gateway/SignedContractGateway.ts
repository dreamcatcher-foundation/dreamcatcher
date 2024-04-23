import {Contract} from "ethers";
import {JsonRpcProvider} from "ethers";
import {Wallet} from "ethers";

export default class SignedContractGateway {
    private _inner: Contract;

    public constructor(address: string, abi: object[], rpcUrl: string, key: string) {
        const provider: JsonRpcProvider = new JsonRpcProvider(rpcUrl);
        const signer: Wallet = new Wallet(key, provider);
        const contract: Contract = new Contract(address, abi, signer);
        this._inner = contract;
    }

    public async call(method: string, ...args: unknown[]): Promise<unknown> {
        return await this._inner.getFunction(method)(...args);
    }
}