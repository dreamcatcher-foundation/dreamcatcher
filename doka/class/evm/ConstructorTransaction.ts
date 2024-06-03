import { ethers as Ethers } from "ethers";
import * as TsResult from "ts-results";
import { SolFile } from "@atlas/shared/os/SolFile.ts";

abstract class IConstructorTransactionState {
    public abstract rpcUrl: string;
    public abstract privateKey: string;
    public abstract bytecode: string;
    public abstract gasPrice?: bigint | "veryLow" | "low" | "standard" | "fast";
    public abstract gasLimit?: bigint;
    public abstract chainId?: bigint;
    public abstract confirmations?: bigint;
}

class ConstructorTransaction {
    public constructor(protected _state: IConstructorTransactionState) {}
    
    public async receipt(): Promise<TsResult.Result<Ethers.TransactionReceipt | null, unknown>> {
        const node: Ethers.JsonRpcProvider = new Ethers.JsonRpcProvider(this._state.rpcUrl);
        const wallet: Ethers.Wallet = new Ethers.Wallet(this._state.privateKey, node);
        return new TsResult.Ok<Ethers.TransactionReceipt | null>(await (await wallet.sendTransaction({
            from: await wallet.getAddress(),
            to: null,
            nonce: await wallet.getNonce(),
            gasPrice:
                this._state.gasPrice === "veryLow"
                    ? 20000000000n :
                this._state.gasPrice === "low"
                    ? 30000000000n :
                this._state.gasPrice === "standard"
                    ? 50000000000n :
                this._state.gasPrice === "fast"
                    ? 70000000000n :
                this._state.gasPrice === undefined
                    ? 20000000000n :
                this._state.gasPrice,
            gasLimit: this._state.gasLimit ?? 10000000n,
            value: 0n,
            data:
                this._state.bytecode instanceof SolFile
                    ? this._state.bytecode
                    
        })).wait(Number(this._state.confirmations)));
    }
}