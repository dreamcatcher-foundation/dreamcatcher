import {JsonRpcProvider, Contract, LogDescription, Log, Network, Wallet, id} from "ethers";

class EthereumVirtualMachineNodeUrl {
    private _nodeUrl: string;

    public constructor(nodeUrl: string) {
        this._nodeUrl = nodeUrl;
    }

    public async chainId(): Promise<bigint> {
        let network: Network = await this._node().getNetwork();
        let chainId: bigint = network.chainId;
        return chainId;
    }

    public async query(
        address: string, 
        abstractBinaryInterface:
            | object[]
            | string[],
        method: string,
        ...args: any[]) {
        let node: JsonRpcProvider = new JsonRpcProvider(this._nodeUrl);
        let contract: Contract = new Contract(address, abstractBinaryInterface, node);
        let response: any = await contract.getFunction(method)(...args);
        return response;
    }

    public async queryEvents(contractAddress: string, contractAbstractBinaryInterface: object[] | string[], contractEventSignature: string) {
        let contract: Contract = new Contract(contractAddress, contractAbstractBinaryInterface, this._node());
        let filter = {
            address: contractAddress,
            topics: [id(contractEventSignature)],
            fromBlock: 0,
            toBlock: "latest"
        };
        let logs: Log[] = await this._node().getLogs(filter);
        let eventLogs: LogDescription[] = [];
        logs.forEach(log => {
            let parsedLog: LogDescription | null = contract.interface.parseLog(log);
            if (parsedLog) {
                eventLogs.push(parsedLog);
            }
        });
        return eventLogs;
    }

    public async sign(contractAddress: string, contractAbstractBinaryInterface: object[] | string[], contractMethod: string, privateKey: string, ...args: any[]) {
        let signer: Wallet = new Wallet(privateKey, this._node());
        let contract: Contract = new Contract(contractAddress, contractAbstractBinaryInterface, signer);
        let response: any = await contract.getFunction(contractMethod)(...args);
        return response;
    }

    private _node() {
        return new JsonRpcProvider(this._nodeUrl);
    }
}

let nodeUrl = new EthereumVirtualMachineNodeUrl("https://rpc.tenderly.co/fork/03e55f5f-556a-4e77-befd-3db0d1761695");
nodeUrl.chainId().then(chainId => console.log(chainId));