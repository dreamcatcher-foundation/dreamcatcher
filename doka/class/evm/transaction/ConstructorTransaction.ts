import { ethers as Ethers } from "ethers";
import * as TsResult from "ts-results";
import { SolFile } from "../../../../app/app/atlas/shared/os/SolFile.ts";
import { Secret } from "../../../../app/app/atlas/shared/os/Secret.ts";

export abstract class IConstructorTransactionState {
    public abstract node: (
        | string
        | Ethers.JsonRpcProvider
    );
    public abstract key: (
        | string
        | Secret  
    );
    public abstract gasPrice?: (
        | bigint
        | "veryLow"
        | "low"
        | "standard"
        | "fast"
    );
    public abstract gasLimit?: bigint;
    public abstract bytecode: (
        | string
        | SolFile
    );
    public abstract chainId?: bigint;
    public abstract confirmations?: bigint;
}

export abstract class IConstructorTransaction {
    public abstract send(): Promise<TsResult.Result<Ethers.TransactionReceipt | null, unknown>>;
}

export class ConstructorTransaction implements IConstructorTransaction {
    public constructor(protected _state: IConstructorTransactionState) {}

    public async send(): Promise<TsResult.Result<Ethers.TransactionReceipt | null, unknown>> {
        try {
            const node: Ethers.JsonRpcProvider = (
                this._state.node instanceof Ethers.JsonRpcProvider
                    ? this._state.node 
                    : new Ethers.JsonRpcProvider(this._state.node)
            );
            const wallet: Ethers.Wallet = new Ethers.Wallet(
                (
                    this._state.key instanceof Secret
                        ? this._state.key.fetch().unwrap()
                        : this._state.key
                ),
                node
            );
            return new TsResult.Ok<Ethers.TransactionReceipt | null>(await (await wallet.sendTransaction({
                from: await wallet.getAddress(),
                to: null,
                nonce: await wallet.getNonce(),
                gasPrice: (
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
                    this._state.gasPrice
                ),
                gasLimit: this._state.gasLimit ?? 10000000n,
                value: 0n,
                data: (
                    this._state.bytecode instanceof SolFile
                        ? `0x${this._state.bytecode.bytecode().unwrap()}` :
                    this._state.bytecode
                ),
                chainId: this._state.chainId ?? (await node.getNetwork()).chainId
            })).wait(Number(this._state.confirmations ?? 0n)));
        }
        catch (error: unknown) {
            return new TsResult.Err<unknown>(error);
        }
    }
}

export { Ethers };
export { TsResult };
export { SolFile };
export { Secret };