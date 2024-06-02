import { type BaseContract } from "ethers";
import { type ContractTransactionResponse } from "ethers";
import { ethers as Ethers } from "ethers";
import * as Ts from "ts-results";

abstract class iTransaction {
    public abstract receipt<Receipt>(): Promise<Ts.Result<Receipt, unknown>>;
}

abstract class iConstructorTransactionDisk {
    public abstract rpcUrl: string;
    public abstract abi: object[] | string[];
    public abstract bytecode: string;
    public abstract args: unknown[];
}

abstract class iTransactionDisk {
    public abstract rpcUrl: string;
    public abstract methodName: string;
    public abstract methodArgs: unknown[];
    public abstract to: string;
    public abstract abi: object[] | string[];
}

class ConstructorTransaction implements iTransaction {
    public constructor(protected _disk: iConstructorTransactionDisk) {}

    public async receipt<BaseContract>(): Promise<Ts.Result<BaseContract, unknown>> {
        try {
            const metamask: unknown = (window as any).ethereum;
            if (!metamask) {
                return new Ts.Err<string>("ConstructorTransaction: metamask is not installed");
            }
            return new Ts.Ok<BaseContract>(await (new Ethers.ContractFactory(
                this._disk.abi,
                this._disk.bytecode,
                new Ethers.BrowserProvider((metamask as any))
            )).deploy(...this._disk.args) as BaseContract);
        }
        catch (error: unknown) {
            return new Ts.Err<unknown>(error);
        }
    }
}

class Transaction implements iTransaction {
    public constructor(protected _disk: iTransactionDisk) {}

    public async receipt<ContractTransactionResponse>(): Promise<Ts.Result<ContractTransactionResponse, unknown>> {
        try {
            const metamask: unknown = (window as any).ethereum;
            if (!metamask) {
                return new Ts.Err<string>("Transaction: metamask is not installed");
            }
            return new Ts.Ok<ContractTransactionResponse>((new Ethers.Contract(
                this._disk.to,
                this._disk.abi,
                new Ethers.BrowserProvider((metamask as any))
            )).getFunction
                (this._disk.methodName)
                (this._disk.methodArgs) as ContractTransactionResponse);
        }
        catch (error: unknown) {
            return new Ts.Err<unknown>(error);
        }
    }
}

export { type BaseContract };
export { type ContractTransactionResponse };
export { Ethers };
export { Ts };
export { iTransaction };
export { iConstructorTransactionDisk };
export { iTransactionDisk };
export { ConstructorTransaction };
export { Transaction };