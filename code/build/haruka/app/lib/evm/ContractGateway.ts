import {Contract, JsonRpcProvider, Wallet} from "ethers";
import SolidityPath from "../os/path/SolidityPath.ts";
import JavaScriptObjectNotationPath from "../os/path/JavaScriptObjectNotationPath.ts";
import Secret from "../os/Secret.ts";
import Url from "../web/Url.ts";

export default class ContractGateway {
    public constructor(
        private readonly _address: string,
        private readonly _abstractBinaryInterfaceish: object[] | SolidityPath | JavaScriptObjectNotationPath | Url,
        private readonly _rpcUrlish: string | Url | Secret,
        private readonly _keyish?: string | Secret
    ) {}

    public static async toAbstractBinaryInterface(abstractBinaryInterfaceish: object[] | SolidityPath | JavaScriptObjectNotationPath | Url): Promise<object[]> {
        if (abstractBinaryInterfaceish instanceof SolidityPath) {
            if (abstractBinaryInterfaceish.abstractBinaryInterface().length == 0) {
                throw new Error("ContractGateway: requires a compiled abstract binary interface but was given an empty interface");
            }
            return abstractBinaryInterfaceish.abstractBinaryInterface();
        }
        else if (abstractBinaryInterfaceish instanceof JavaScriptObjectNotationPath) {
            return abstractBinaryInterfaceish.load() as object[];
        }
        else if (abstractBinaryInterfaceish instanceof Url) {
            return (await abstractBinaryInterfaceish.response()).data();
        }
        else {
            return abstractBinaryInterfaceish;
        }
    }

    public static toUrl(urlish: string | Url | Secret): string {
        if (urlish instanceof Url) {
            return urlish.get();
        }
        else if (urlish instanceof Secret) {
            if (!urlish.get()) {
                throw new Error("ContractGateway: missing secret");
            }
            return urlish.get()!;
        }
        else {
            return urlish;
        }
    }

    public static toKey(keyish: string | Secret): string {
        if (keyish instanceof Secret) {
            if (!keyish.get()) {
                throw new Error("ContractGateway: missing secret");
            }
            return keyish.get()!;
        }
        else {
            return keyish;
        }
    }

    public async response(method: string, ...args: any[]): Promise<any> {
        if (this._keyish) {
            const provider: JsonRpcProvider = new JsonRpcProvider(ContractGateway.toUrl(this._rpcUrlish));
            const signer: Wallet = new Wallet(ContractGateway.toKey(this._keyish), provider);
            const contract: Contract = new Contract(this._address, await ContractGateway.toAbstractBinaryInterface(this._abstractBinaryInterfaceish), signer);
            return await contract.getFunction(method)(...args);
        }
        const provider: JsonRpcProvider = new JsonRpcProvider(ContractGateway.toUrl(this._rpcUrlish));
        const contract: Contract = new Contract(this._address, await ContractGateway.toAbstractBinaryInterface(this._abstractBinaryInterfaceish), provider);
        return await contract.getFunction(method)(...args);
    }
}