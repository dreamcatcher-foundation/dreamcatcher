import {Wallet} from "ethers";
import {JsonRpcProvider} from "ethers";
import {ContractFactory} from "ethers";
import {BrowserProvider} from "ethers";
import {Contract} from "ethers";

class Material {
    public constructor(
        public readonly abi: object[],
        public readonly bytecode: string
    ) {}
}

/**
 * Compiles directly from a path to a contract interface
 */
function compileSOL(path: string) {
    let pathShards: string[] = path.split("/");
    let lastPathShard: string | undefined = pathShards.at(-1);
    if (!lastPathShard) return "cannot find shards";
    let finalShards: string[] = lastPathShard.split(".");
    let fileExtension: string | undefined = finalShards.at(-1);
    let fileName: string | undefined = finalShards.at(-2);
    if (!fileExtension) return "missing file extension";
    if (!fileName) return "missing file name";

}

compileSOL("code/build/HonoBuild/static/sol/native/Diamond.sol")

function _extractFileNameAndExtension(path: string) {

}

class CompiledContractGateway {
    _address: string;
    _path: string;
    _url: string;
}

class SignedAndCompiledContractGateway {}

class NativeGateway {}

function ContractRpcGateway(
    _address: string,
    _abi: object[],
    _url: string,
    _key?: string) {
    let _network: JsonRpcProvider = new JsonRpcProvider(_url);
    if (_key) {
        
    }
    let _signer: Wallet | undefined;
    let _contract: Contract;
    
}

class SignedContractGateway {
    private _network: JsonRpcProvider;
    private _signer: Wallet;
    private _contract: Contract;

    public constructor(
        private readonly _address: string,
        private readonly _abi: object[],
        private readonly _url: string,
        private readonly _key: string
    ) {
        this._network = new JsonRpcProvider(this._url);
        this._signer = new Wallet(this._key, this._network);
        this._contract = new Contract(this._address, this._abi, this._signer);
    }

    public call(method: string, ...args: unknown[]) {
        this._contract.getFunction(method)(...args);
    }
}

class ContractGateway {
    
}

class ContractGateway {
    private _address: string = "";
    private _abi: object[] = [];
    private _url: string = "";
    private _key: string = "";
    private _network: JsonRpcProvider;
    private _signer: Wallet;
    private _contract: Contract;

    public constructor(address: string, abi: object[], url: string, key?: string) {
        this._address = address;
        this._abi = abi;
        this._url = url;
        this._key = key ?? "";
        this._network = new JsonRpcProvider(this._url);
        if (this._key != "") {
            this._signer = new Wallet(this._key, this._network);
            this._contract = new Contract(this._address, this._abi, this._signer);
        }
        else {
            this._contract = new Contract(this._address, this._abi, this._network);
        }
    }

    public call(method: string, ...args: unknown[]) {
        this._contract.getFunction(method)(...args);
    }
}

class MetamaskContractGateway {
    private _provider: BrowserProvider;
    private _contract: Contract;

    public constructor(
        private readonly _address: string,
        private readonly _abi: object[]) {
        let self: this = this;
        let windowAsAny: any = window as any;
        let metamask: any = windowAsAny.ethereum;
        self._provider = new BrowserProvider(metamask);
        self._contract = new Contract(
            self._address,
            self._abi,
            self._provider);
    }

    public async call(method: string, ...args: unknown[]): Promise<unknown> {
        let self: this = this;
        return await self._contract.getFunction(method)(...args);
    }
}



let myContract = new MetamaskContractGateway("", []);
myContract.call("withdraw");

let gateway = new ContractGateway("", [], "");
gateway.call("deposit", 49, "");

class DeployedContract {
    public constructor() {}


}


export async function deploy({
    abi,
    bytecode,
    url,
    key,
    args}: {
        abi: object[];
        bytecode: string;
        url: string;
        key: string;
        args?: unknown[];}) {
    let network: JsonRpcProvider = new JsonRpcProvider(url);
    let signer: Wallet = new Wallet(key, network);
    let deployer: ContractFactory = new ContractFactory(abi, bytecode, signer);
    return await deployer.deploy(args);
}

export async function deployWithMetamask({
    abi,
    bytecode,
    args}: {
        abi: object[];
        bytecode: string;
        args?: unknown[];}) {
    let windowAsAny: any = window as any;
    let ethereum: any = windowAsAny.ethereum;
    if (!ethereum) {
        return;
    }
    let network: BrowserProvider = new BrowserProvider(ethereum);
    let deployer: ContractFactory = new ContractFactory(abi, bytecode, network);
    return await deployer.deploy(args);
}