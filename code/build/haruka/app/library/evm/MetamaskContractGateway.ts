import {Contract, BrowserProvider} from "ethers";
import Url from "../web/Url.ts";

export default class MetamaskContractGateway {
    public constructor(
        private readonly _address: string,
        private readonly _abstractBinaryInterface: object[] | Url
    ) {}

    public async response(method: string, ...args: any[]): Promise<any> {
        let abstractBinaryInterface: object[] = [];
        if (this._abstractBinaryInterface instanceof Url) {
            abstractBinaryInterface = (await this._abstractBinaryInterface.response()).data();
        }
        else {
            abstractBinaryInterface = this._abstractBinaryInterface;
        }
        const windowAsAny: any = window as any;
        const metamask: any = windowAsAny.ethereum;
        const provider: BrowserProvider = new BrowserProvider(metamask);
        const contract: Contract = new Contract(this._address, abstractBinaryInterface, provider);
        return await contract.getFunction(method)(...args);
    }
}