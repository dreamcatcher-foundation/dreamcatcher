import { ethers as Ethers } from "ethers";
import * as TsResult from "ts-results";
import { SolFile } from "../../../../app/app/atlas/shared/os/SolFile.ts";
import { Secret } from "../../../../app/app/atlas/shared/os/Secret.ts";

abstract class ITransactionConstructorPayload {
    public abstract node:
        | string
        | Ethers.JsonRpcProvider;
    public abstract privateKey:
        | string
        | Secret;
    public abstract gasPrice:
        | bigint
        | "veryLow"
        | "low"
        | "standard"
        | "fast";
    public abstract gasLimit?: bigint;
    public abstract bytecode:
        | string
        | SolFile;
    public abstract chainId?: bigint;
    public abstract confirmations?: bigint;
}

class Transaction {
    protected _state: {
        node: Ethers.JsonRpcProvider;
        privateKey: string;
        gasPrice: bigint;
        gasLimit: bigint;
        bytecode: string;
        chainId: bigint;
        confirmations: bigint;
    };

    public constructor(payload: ITransactionConstructorPayload) {
        this._state = {
            node: payload.node instanceof Ethers.JsonRpcProvider
                ? payload.node
                : new Ethers.JsonRpcProvider(payload.node),
            privateKey: payload.privateKey instanceof Secret
                ? payload.privateKey.fetch().unwrap()
                : payload.privateKey,
            3
        };
    }
}











export abstract class IMultiModalValue<Item> {
    public abstract resolve(): Promise<Item>;
}

class PrivateKey implements IMultiModalValue<string> {
    public constructor(
        protected _state: {
            inner:
                | string
                | Secret
        }
    ) {}

    public async resolve(): Promise<string> {
        return (
            this._state.inner instanceof Secret
                ? this._state.inner.fetch().unwrap()
                : this._state.inner
        );
    }
}

class GasPrice implements IMultiModalValue<bigint> {
    public constructor(
        protected _state: {
            inner:
                | bigint
                | "veryLow"
                | "low"
                | "standard"
                | "fast"
        }
    ) {}

    public async resolve(): Promise<bigint> {
        return (
            this._state.inner === "veryLow"
                ? 20000000000n :
            this._state.inner === "low"
                ? 30000000000n :
            this._state.inner === "standard"
                ? 50000000000n :
            this._state.inner === "fast"
                ? 70000000000n :
            this._state.inner === undefined
                ? 20000000000n :
            this._state.inner
        );
    }
}

export abstract class ITransaction {
    public abstract rpcUrl: Ethers.JsonRpcProvider;
    public abstract privateKey: PrivateKey;
    public abstract gasPrice: GasPrice;
    public abstract gasLimit: bigints;
}

abstract class IEthereumVirtualMachine {
    public abstract processTransaction(): Promise<Ethers.TransactionReceipt>;
}

class EthereumVirtualMachine implements IEthereumVirtualMachine {
    public async sendTransaction(
        transaction:    
            | ITransaction
    ) {

    }
}

export class Transaction {
    public constructor(protected _state: ITransaction) {}

    public async send() {
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
        (await wallet.sendTransaction({
            from: await wallet.getAddress(),
            to: this._state.address,

        }))
    }
}