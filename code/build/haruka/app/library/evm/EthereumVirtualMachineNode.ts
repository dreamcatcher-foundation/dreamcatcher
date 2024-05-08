import {JsonRpcProvider, Wallet as EthersWallet} from "ethers";


function EthereumVirtualMachineNode(): EthereumVirtualMachineNode {
    
}


export class EthereumVirtualMacshineNode implements EthereumVirtualMachineNode {
    public constructor(
        private readonly _url: string,
        private readonly _key: string) {}

    public get(): EthersWallet {
        const {_url, _key} = this;
        const node: JsonRpcProvider = new JsonRpcProvider(_url);
        const signer: EthersWallet = new EthersWallet(_key, node);
        return signer;
    }
}