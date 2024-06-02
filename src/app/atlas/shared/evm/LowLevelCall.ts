import { ethers as Ethers } from "ethers";

class LowLevelCall {
    public constructor(
        private readonly _state: {
            rpcUrl: string;
            privateKey: string;
            method: {
                signature: string;
                args: unknown[];
            };
            address: string;
            value: number;
        }
    ) {}

    public async receipt(): Promise<Ethers.TransactionReceipt> {
        let node: Ethers.JsonRpcProvider = new Ethers.JsonRpcProvider(this._state.rpcUrl);
        let wallet: Ethers.Wallet = new Ethers.Wallet(this._state.privateKey, node);
        let i: Ethers.Interface = new Ethers.Interface([]);
        let data: string = i.encodeFunctionData(this._state.method.signature, this._state.method.args);
        let response: Ethers.TransactionResponse = await wallet.sendTransaction({
            to: this._state.address,
            data: data,
            value: Ethers.parseEther(String(this._state.value))
        });
        return (await response.wait())!;
    }
}