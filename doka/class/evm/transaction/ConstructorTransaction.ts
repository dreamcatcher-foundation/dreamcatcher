import { ethers as Ethers } from "ethers";
import * as TsResult from "ts-results";
import { SolFile } from "@atlas/shared/os/SolFile.ts";
import { Secret } from "@atlas/shared/os/Secret.ts";

class Bytecode {
    public constructor(
        protected _inner: 
            | string
            | SolFile
    ) {}

    public resolve(): string {
        return this._inner instanceof SolFile
            ? this._inner.bytecode().unwrap()
            : this._inner;
    }
}

class GasPrice {
    public constructor(
        protected _inner?:
            | bigint
            | "veryLow"
            | "low"
            | "standard"
            | "fast"
    ) {}

    public resolve(): bigint {
        return (
            this._inner === "veryLow"
                ? 20000000000n :
            this._inner === "low"
                ? 30000000000n :
            this._inner === "standard"
                ? 50000000000n :
            this._inner === "fast"
                ? 70000000000n :
            this._inner === undefined
                ? 20000000000n :
            this._inner
        );
    }
}

class PrivateKey {
    public constructor(
        protected _inner:
            | string
            | Secret
    ) {}

    public resolve(): string {
        return (
            this._inner instanceof Secret
                ? this._inner.fetch().unwrap()
                : this._inner
        );
    }
}

abstract class IConstructorTransactionArgs {
    public abstract readonly rpcUrl: string;
    public abstract readonly privateKey: PrivateKey;
    public abstract readonly gasPrice?: GasPrice;
    public abstract readonly gasLimit?: bigint;
    public abstract readonly bytecode: Bytecode;
    public abstract readonly chainId?: bigint;
    public abstract readonly confirmations?: bigint;
}

class ConstructorTransaction {
    protected _receipt: Promise<TsResult.Result<Ethers.TransactionReceipt, unknown>>;

    public constructor(args: IConstructorTransactionArgs) {
        try {
            const node: Ethers.JsonRpcProvider = new Ethers.JsonRpcProvider(args.rpcUrl);
            const wallet: Ethers.Wallet = new Ethers.Wallet(args.privateKey.resolve(), node);
            return await (await wallet.sendTransaction({

            }))
        }
    }

    public async receipt() {
        
    }
}