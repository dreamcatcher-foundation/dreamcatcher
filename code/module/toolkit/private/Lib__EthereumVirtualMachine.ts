import {Contract} from "ethers";
import {BrowserProvider} from "ethers";
import {JsonRpcProvider} from "ethers";
import {Wallet} from "ethers";
import {SolidityPath} from "./Lib__Path.ts";
import {Secret} from "./Secret.ts";
import {Url} from "./Url.ts";

class MetamaskContractGateway {
    public constructor(
        private readonly _address: string,
        private readonly _abstractContractInterface: object[] | Url
    ) {}

    public async response(method: string, ...args: any[]): Promise<any> {
        let abstractBinaryInterface: object[] = [];
        if (this._abstractContractInterface instanceof Url) {
            const url: Url = this._abstractContractInterface;
            abstractBinaryInterface = (await url.response()).data();
        }
        const windowAsAny: any = window as any;
        const metamask: any = windowAsAny.ethereum;
        const provider: BrowserProvider = new BrowserProvider(metamask);
        const contract: Contract = new Contract(this._address, abstractBinaryInterface, provider);
        return await contract.getFunction(method)(...args);
    }
}

class JsonRpcContractGateway {
    public constructor(
        private readonly _address: string,
        private readonly _abstractBinaryInterface: object[] | SolidityPath | Url,
        private readonly _rpcUrl: string | Url | Secret,
        private readonly _key?: string | Secret
    ) {}

    public async response(method: string, ...args: any[]): Promise<any> {
        let abstractBinaryInterface: object[] = [];
        if (this._abstractBinaryInterface instanceof SolidityPath) {
            const path: SolidityPath = this._abstractBinaryInterface;
            if (!path.abstractBinaryInterface()) {
                throw new Error("JsonRpcContractGateway: Requires an abtract binary interface but failed to get one");
            }
            abstractBinaryInterface = path.abstractBinaryInterface();
        }
        else if (this._abstractBinaryInterface instanceof Url) {
            const url: Url = this._abstractBinaryInterface;
            abstractBinaryInterface = (await url.response()).data();
        }
        else {
            abstractBinaryInterface = this._abstractBinaryInterface;
        }
        let url: string = "";
        if (this._rpcUrl instanceof Secret) {
            const secret: Secret = this._rpcUrl;
            if (!secret.get()) {
                throw new Error("JsonRpcContractGateway: Was given an empty secret as its rpc url.");
            }
            url = secret.get()!;
        }
        else if (this._rpcUrl instanceof Url) {
            url = this._rpcUrl.get();
        }
        else {
            url = this._rpcUrl;
        }
        let key: string | undefined;
        if (this._key instanceof Secret) {
            const secret: Secret = this._key;
            if (!secret.get()) {
                throw new Error("JsonRpcContractGateway: Was given an empty secret as its key");
            }
            key = secret.get()!;
        }
        else {
            key = this._key;
        }
        const provider: JsonRpcProvider = new JsonRpcProvider(url);
        if (key) {
            const signer: Wallet = new Wallet(key, provider);
            const contract: Contract = new Contract(this._address, abstractBinaryInterface, signer);
            return await contract.getFunction(method)(...args);
        }
        const contract: Contract = new Contract(this._address, abstractBinaryInterface, provider);
        return await contract.getFunction(method)(...args);
    }
}

export {MetamaskContractGateway};
export {JsonRpcContractGateway};