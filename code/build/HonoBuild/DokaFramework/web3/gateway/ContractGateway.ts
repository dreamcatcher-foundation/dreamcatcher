import {Contract} from "ethers";
import {JsonRpcProvider} from "ethers";

export default class ContractGateway {
    private _inner: Contract;

    public constructor(address: string, abi: object[], rpcUrl: string) {
        const provider: JsonRpcProvider = new JsonRpcProvider(rpcUrl);
        const contract: Contract = new Contract(address, abi, provider);
        this._inner = contract;
    }

    public async call(method: string, ...args: unknown[]): Promise<unknown> {
        return await this._inner.getFunction(method)(...args);
    }
}