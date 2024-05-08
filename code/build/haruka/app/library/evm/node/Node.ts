import {JsonRpcProvider, Wallet, BrowserProvider, Contract} from "ethers";
import Url from "../../web/Url.ts";
import Secret from "../../os/Secret.ts";

class EthereumVirtualMachineNodes{
    private _url: Url;
    private _key?: string;
    
    public constructor(url: Url, key?: string) {
        this._url = url;
    }



    private _node() {
        if (this._key) {
            const node: JsonRpcProvider = new JsonRpcProvider(this._url.get());
            const signer: Wallet = new Wallet(this._key, node);
            return signer;
        }
        return new JsonRpcProvider(this._url.get());
    }
}

function Wallet(): Wallet {
    
}

function EthereumVirtualMachineNode(_url: string, _key?: string) {

    function chainId() {
        node()
    }

    function node(): JsonRpcProvider | Wallet {
        const hasKey: boolean = !!_key;
        if (hasKey) {
            const node: JsonRpcProvider = new JsonRpcProvider(this._url.get());
            return new Wallet(this._key, node);
        }
        return new JsonRpcProvider(_url);
    }

    function Contract(address: string, abi: object[] | string[]) {
        return new Contract(address, abi, node());
    }

    function get() {
        Contract("", [""]).getFunction("")();
    }
}