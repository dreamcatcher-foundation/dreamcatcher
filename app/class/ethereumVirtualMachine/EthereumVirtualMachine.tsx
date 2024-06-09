import { type IEthereumVirtualMachine } from "./IEthereumVirtualMachine.ts";
import * as TsResult from "ts-results";
import * as Ether from "ethers";

export const evm: () => IEthereumVirtualMachine = (function(): () => IEthereumVirtualMachine {
    let currentProvider_: Ether.BrowserProvider;
    let i_: IEthereumVirtualMachine;

    async function query({
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
            return TsResult.Ok<unknown>(await new Ether.Contract(to, [methodSignature], (await provider_()).unwrap()).getFunction(methodName)(...methodArgs));
        }
        catch (error: unknown) {
            return TsResult.Err<unknown>(error);
        }
    }

    async function invoke({
        to,
        methodSignature,
        methodName,
        methodArgs=[],
        gasPrice=50000000000n,
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
    }): Promise<TsResult.Result<Ether.TransactionReceipt | null, unknown>> {
        try {
            return TsResult.Ok<Ether.TransactionReceipt | null>(await (await (await signer_()).unwrap().sendTransaction({
                from: (await signerAddress_()).unwrap(),
                to: to,
                nonce: (await generateNonce_()).unwrap(),
                gasPrice:
                    gasPrice === "verySlow"
                        ? 20000000000n :
                    gasPrice === "slow"
                        ? 30000000000n :
                    gasPrice === "normal"
                        ? 50000000000n :
                    gasPrice === "fast"
                        ? 70000000000n :
                    gasPrice,
                gasLimit: gasLimit,
                chainId: chainId,
                value: value,
                data: new Ether.Interface([methodSignature]).encodeFunctionData(methodName, methodArgs)
            })).wait(Number(confirmations)));
        }
        catch (error: unknown) {
            return TsResult.Err<unknown>(error);
        }
    }

    async function deploy({
        bytecode,
        gasPrice=50000000000n,
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
    }): Promise<TsResult.Result<Ether.TransactionReceipt | null, unknown>> {
        try {
            return TsResult.Ok<Ether.TransactionReceipt | null>(await (await (await signer_()).unwrap().sendTransaction({
                from: (await signerAddress_()).unwrap(),
                to: null,
                nonce: (await generateNonce_()).unwrap(),
                gasPrice:
                    gasPrice === "verySlow"
                        ? 20000000000n :
                    gasPrice === "slow"
                        ? 30000000000n :
                    gasPrice === "normal"
                        ? 50000000000n :
                    gasPrice === "fast"
                        ? 70000000000n :
                    gasPrice,
                gasLimit: gasLimit,
                chainId: chainId,
                value: value,
                data: `0x${bytecode}`
            })).wait(Number(confirmations)));
        }
        catch (error: unknown) {
            return TsResult.Err<unknown>(error);
        }
    }

    async function provider_(): Promise<TsResult.Result<Ether.BrowserProvider, unknown>> {
        if (!window) {
            return TsResult.Err<string>("WindowNotAvailable");
        }
        if (!(window as any).ethereum) {
            return TsResult.Err<string>("EthereumNotAvailable");
        }
        currentProvider_ = new Ether.BrowserProvider((window as any).ethereum);
        try {
            const accounts: string[] = await currentProvider_.send("eth_accounts", []);
            if (accounts.length > 0) {
                return TsResult.Ok<Ether.BrowserProvider>(currentProvider_);
            }
            else {
                await currentProvider_.send("eth_requestAccounts", []);
                return TsResult.Ok<Ether.BrowserProvider>(currentProvider_);
            }
        }
        catch (error: unknown) {
            return TsResult.Err<unknown>(error);
        }
    }

    async function signer_(): Promise<TsResult.Option<Ether.JsonRpcSigner>> {
        if ((await provider_()).err) {
            return TsResult.None;
        }
        return TsResult.Some<Ether.JsonRpcSigner>(await (await provider_()).unwrap().getSigner());
    }

    async function signerAddress_(): Promise<TsResult.Option<string>> {
        if ((await signer_()).none) {
            return TsResult.None;
        }
        return TsResult.Some<string>(await (await signer_()).unwrap().getAddress());
    }

    async function generateNonce_(): Promise<TsResult.Option<number>> {
        if ((await signer_()).none) {
            return TsResult.None;
        }
        return TsResult.Some<number>(await (await signer_()).unwrap().getNonce());
    }

    return function(): IEthereumVirtualMachine {
        if (!i_) {
            return i_ = { query, invoke, deploy };
        }
        return i_
    }
})();