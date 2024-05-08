import Secret from "../os/Secret.ts";
import ethers, {Log, LogDescription, Network, Contract, JsonRpcProvider, Wallet as EthersWallet, HDNodeWallet} from "ethers";

async function chainId(nodeUrl: string): Promise<bigint> {
    let node: JsonRpcProvider = new JsonRpcProvider(nodeUrl);
    let network: Network = await node.getNetwork();
    let chainId: bigint = network.chainId;
    return chainId;
}

function EventSignature(eventName: string, parameters: string[]): string {
    if (parameters.length === 0) {
        return `${eventName}()`;
    }
    let parametersSignature: string = "";
    for (let i = 0; i < parameters.length; i += 1) {
        parametersSignature += parameters[i];
        if (i !== parameters.length - 1) {
            parametersSignature += ",";
        }
    }
    return `${eventName}(${parametersSignature})`;
}

type QueryPayload = {
    address: string;
    abstractBinaryInterface: object[] | string[];
    methodName: string;
    nodeUrl: string;
    args?: any[];
};

export async function query(payload: QueryPayload): Promise<any> {
    let node: JsonRpcProvider = new JsonRpcProvider(payload.nodeUrl);
    let contract: Contract =
        new Contract(
            payload.address,
            payload.abstractBinaryInterface,
            node);
    let response: any = await contract.getFunction(payload.methodName)(...payload.args ?? []);
    return response;
}

type QueryEventsPayload = {
    address: string;
    abstractBinaryInterface: object[] | string[];
    eventSignature: ReturnType<typeof EventSignature>;
    nodeUrl: string;
};

async function queryEvents(payload: QueryEventsPayload): Promise<LogDescription[]> {
    let node: JsonRpcProvider = new JsonRpcProvider(payload.nodeUrl);
    let contract: Contract = new Contract(payload.address, payload.abstractBinaryInterface, node);
    let filter = {
        address: payload.address,
        topics: [ethers.id(payload.eventSignature)],
        fromBlock: 0,
        toBlock: "latest"
    };
    let filteredLogs: LogDescription[] = [];
    let logs: Log[] = await node.getLogs(filter);
    logs.forEach(log => {
        let parsedLogs: LogDescription | null = contract.interface.parseLog(log);
        if (!parsedLogs) {
            return;
        }
        filteredLogs.push(parsedLogs);
    });
    return filteredLogs;
}







class EthereumVirtualMachines {
    private _url: string;
    private _key: string;

    public constructor(url: string, key: string) {
        this._url = url;
        this._key = key;

        const {} = this;
    }

    public async chainId() {
        return (await this._node.provider?.getNetwork())?.chainId;
    }    

    public async query(address: string, abstractBinaryInterface: object[] | string[], method: string, ...args: any[]): Promise<any> {
        return new Promise(function(resolve, reject) {
            const contract: EthersContract = new EthersContract(address, abstractBinaryInterface, this._node);

        });
        try {
            const abstractBinaryInterfaceIsInArrayFormat: boolean = Array.isArray(abstractBinaryInterface);
            if (!abstractBinaryInterfaceIsInArrayFormat) {
                abstractBinaryInterface = [abstractBinaryInterface] as string[];
            }
            const contract: EthersContract = new EthersContract(contractAddress, abstractBinaryInterface, this._node);
            const response: Promise<any> = contract.getFunction()
        }
        catch {

        }
    }

    public createNewAccount() {
        const account: HDNodeWallet = EthersWallet.createRandom(this._node());
    }

    public fundAccount() {

    }

    /**
     * EventName(address,uint256)
     */
    public async queryEvents(address: string, abstractBinaryInterface: object[], eventSignature: EventSignature) {
        const contract: EthersContract = new EthersContract(address, abstractBinaryInterface, this._node());
        const filter = {
            address: address,
            topics: [ethers.id(eventSignature)],
            fromBlock: 0,
            toBlock: "latest"
        };
        const logs = await this._node().getLogs(filter);
        let results: (LogDescription)[] = [];
        logs.forEach(log => {
            const parsedLog: LogDescription | null = contract.interface.parseLog(log);
            if (parsedLog) {
                results.push(parsedLog);
            }
        });
        return results;
    }

    private _node() {
        return new JsonRpcProvider(this._url);
    }
}

function EthereumVirtualMachiness(_nodeRpcUrl: string, _privateKey: string) {
    let _instance = {usePrivateKey, useNodeRpcUrl};

    function get() {

    }


    function usePrivateKey(key: string) {
        _privateKey = key;
        _reboot();
        return _instance;
    }

    function useNodeRpcUrl(url: string) {
        _nodeRpcUrl = url;
        _reboot();
        return _instance;
    }

    function _reboot() {
        const hasNodeRpcUrl: boolean = !!_nodeRpcUrl;
        const hasPrivateKey: boolean = !!_privateKey;
        if (!hasNodeRpcUrl) {
            return;
        }
        if (hasPrivateKey) {
            const node: JsonRpcProvider = new JsonRpcProvider(_nodeRpcUrl);
            const signer: Wallet = new Wallet(_privateKey!, node);
            return signer;
        }
        
    }

    function rebuild() {

    }

    return _instance;
}

const polygon = EthereumVirtualMachine();
polygon.usePrivateKey("");
polygon.useNodeRpcUrl("");
polygon.createNewAccount();
polygon.get();

export class EthereumVirtualMachines {
    private _nodeRpcUrl: string;
    private _key: string;

    public constructor(nodeRpcUrl: string) {
        this._nodeRpcUrl = nodeRpcUrl;

    }

    /**
     * ie. address,uint256
     * 
     */
    public async get(contractAddress: string, functionName: string, functionParameters: string, functionReturn: string, ...args: any[]) {
        const functionSignature = `function ${functionName}(${functionParameters}) external view returns (${functionReturn})`;
        const nodeRpc: JsonRpcProvider = new JsonRpcProvider(this._nodeRpcUrl);
        const contract: Contract = new Contract(contractAddress, [functionSignature], nodeRpc);
        return await contract.getFunction(functionName)(...args);
    }

    public async sign() {

    }

    public async deploy() {}
}

const polygonEVM = new EthereumVirtualMachine("")
polygonEVM.get("", "", "address,uint256", "uint256");