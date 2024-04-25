import {Contract} from "ethers";
import {BrowserProvider} from "ethers";
import Url from "../../web/url/Url.ts";

export default class MetamaskContractGateway {
    public constructor(
        private readonly _address: string,
        private readonly _abi: object[] | Url
    ) {}

    public async response(method: string, ...args: any[]): Promise<any> {
        let abi: object[] = [];
        if (this._abi instanceof Url) {
            const url: Url = this._abi;
            abi = (await url.response()).data();
        }
        const windowAsAny: any = window as any;
        const metamask: any = windowAsAny.ethereum;
        const provider: BrowserProvider = new BrowserProvider(metamask);
        const contract: Contract = new Contract(this._address, abi, provider);
        return await contract.getFunction(method)(...args);
    }
}