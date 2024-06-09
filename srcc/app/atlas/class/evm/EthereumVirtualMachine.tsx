import { ethers as Ethers } from "ethers";
import * as TsResult from "ts-results";

export class EthereumVirtualMachine {
    private constructor() {}
    private static _provider: Ethers.BrowserProvider;

    public static async provider(): Promise<TsResult.Result<Ethers.BrowserProvider, unknown>> {
        if (!window) {
            return new TsResult.Err<string>("!window");
        }
        if (!(window as any).ethereum) {
            return new TsResult.Err<string>("!window.ethereum");
        }
        this._provider = new Ethers.BrowserProvider((window as any).ethereum);
        try {
            let accounts: string[] = await this._provider.send("eth_accounts", []);
            if (accounts.length > 0) {
                return new TsResult.Ok<Ethers.BrowserProvider>(this._provider);
            }
            else {
                await this._provider.send("eth_requestAccounts", []);
                return new TsResult.Ok<Ethers.BrowserProvider>(this._provider);
            }
        }
        catch (error: unknown) {
            return new TsResult.Err<unknown>(error);
        }
    }

    public static async signer(): Promise<TsResult.Option<Ethers.JsonRpcSigner>> {
        if ((await this.provider()).err) {
            return TsResult.None;
        }
        return new TsResult.Some<Ethers.JsonRpcSigner>(await (await this.provider()).unwrap().getSigner());
    }

    public static async signerAddress(): Promise<TsResult.Option<string>> {
        if ((await this.signer()).none) {
            return TsResult.None;
        }
        return new TsResult.Some<string>(await (await this.signer()).unwrap().getAddress());
    }

    public static async generateNonce(): Promise<TsResult.Option<number>> {
        if ((await this.signer()).none) {
            return TsResult.None;
        }
        return new TsResult.Some<number>(await (await this.signer()).unwrap().getNonce());
    }

    public static async query({
        to,
        methodSignature,
        methodName,
        methodArgs=[]}: {
            to: string;
            methodSignature: string;
            methodName: string;
            methodArgs?: unknown[];
    }): Promise<TsResult.Result<unknown, unknown>> {
        try {
            return new TsResult.Ok<unknown>(await (new Ethers.Contract(to, [methodSignature], ((await this.provider()).unwrap())))
                .getFunction(methodName)(...methodArgs));
        }
        catch (error: unknown) {
            return new TsResult.Err<unknown>(error);
        }
    }

    public static async invoke({
        to,
        methodSignature,
        methodName,
        methodArgs=[],
        gasPrice=20000000000n,
        gasLimit=10000000n,
        value=0n,
        chainId=undefined,
        confirmations=1n}: {
            to: string;
            methodSignature: string;
            methodName: string;
            methodArgs?: unknown[];
            gasPrice?:
                | bigint
                | "verySlow"
                | "slow"
                | "normal"
                | "fast";
            gasLimit?: bigint;
            value?: bigint;
            chainId?: bigint;
            confirmations?: bigint;    
    }): Promise<TsResult.Result<Ethers.TransactionReceipt | null, unknown>> {
        try {
            return new TsResult.Ok<Ethers.TransactionReceipt | null>(await (await (await this.signer()).unwrap().sendTransaction({
                from: (await this.signerAddress()).unwrap(),
                to: to,
                nonce: (await this.generateNonce()).unwrap(),
                gasPrice: (
                    gasPrice === "verySlow"
                        ? 20000000000n :
                    gasPrice === "slow"
                        ? 30000000000n :
                    gasPrice === "normal"
                        ? 50000000000n :
                    gasPrice === "fast"
                        ? 70000000000n :
                    gasPrice
                ),
                gasLimit: gasLimit,
                chainId: chainId,
                value: value,
                data: new Ethers
                    .Interface([methodSignature])
                    .encodeFunctionData(methodName, methodArgs)
            })).wait(Number(confirmations)))
        }
        catch (error: unknown) {
            return new TsResult.Err<unknown>(error);
        }
    }

    public static async deploy({
        bytecode,
        gasPrice=20000000000n,
        gasLimit=10000000n,
        value=0n,
        chainId=undefined,
        confirmations=1n}: {
            bytecode: string;
            gasPrice?:
                | bigint
                | "verySlow"
                | "slow"
                | "normal"
                | "fast";
            gasLimit?: bigint;
            value?: bigint;
            chainId?: bigint;
            confirmations?: bigint;
    }): Promise<TsResult.Result<Ethers.TransactionReceipt | null, unknown>> {
        try {
            return new TsResult.Ok<Ethers.TransactionReceipt | null>(await (await (await this.signer()).unwrap().sendTransaction({
                from: (await this.signerAddress()).unwrap(),
                to: null,
                nonce: (await this.generateNonce()).unwrap(),
                gasPrice: (
                    gasPrice === "verySlow"
                        ? 20000000000n :
                    gasPrice === "slow"
                        ? 30000000000n :
                    gasPrice === "normal"
                        ? 50000000000n :
                    gasPrice === "fast"
                        ? 70000000000n :
                    gasPrice
                ),
                gasLimit: gasLimit,
                chainId: chainId,
                value: value,
                data: "0x" + bytecode
            })).wait(Number(confirmations)))
        }
        catch (error: unknown) {
            return new TsResult.Err<unknown>(error);
        }
    }
}