import {Contract} from "ethers";
import {JsonRpcProvider} from "ethers";
import {Wallet} from "ethers";
import SolPath from "../../os/path/SolPath.ts";
import Url from "../../web/url/Url.ts";
import Secret from "../../os/Secret.ts";

export default class JsonRpcContractGateway {
    public constructor(
        private readonly _address: string,
        private readonly _abi: object[] | SolPath | Url,
        private readonly _url: Url | Secret,
        private readonly _key?: string | Secret
    ) {}

    public async response(method: string, ...args: any[]): Promise<any> {
        let abi: object[] = [];
        if (this._abi instanceof SolPath) {
            const path: SolPath = this._abi;
            if (!path.abi()) {
                throw new Error("JsonRpcContractGateway: missing sol path abi");
            }
            abi = path.abi();
        }
        else if (this._abi instanceof Url) {
            const url: Url = this._abi;
            abi = (await url.response()).data();
        }
        else {
            abi = this._abi;
        }
        let url: string = "";
        if (this._url instanceof Secret) {
            const secret: Secret = this._url;
            if (!secret.get()) {
                throw new Error("JsonRpcContractGateway: missing secret url");
            }
            url = secret.get()!;
        }
        else {
            url = this._url.get();
        }
        let key: string | undefined;
        if (this._key instanceof Secret) {
            const secret: Secret = this._key;
            if (!secret.get()) {
                throw new Error("JsonRpcContractGateway: missing secret key");
            }
            key = secret.get()!;
        }
        else {
            key = this._key;
        }
        const provider: JsonRpcProvider = new JsonRpcProvider(url);
        if (key) {
            const signer: Wallet = new Wallet(key, provider);
            const contract: Contract = new Contract(this._address, abi, signer);
            return await contract.getFunction(method)(...args);
        }
        const contract: Contract = new Contract(this._address, abi, provider);
        return await contract.getFunction(method)(...args);
    }
}