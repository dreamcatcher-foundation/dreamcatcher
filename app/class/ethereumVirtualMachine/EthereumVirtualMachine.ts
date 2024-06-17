import { type IEthereumVirtualMachine } from "./IEthereumVirtualMachine.ts";
import * as TsResult from "ts-results";
import * as Ethers from "ethers";

export function EthereumVirtualMachine(signer_: Ethers.Wallet): IEthereumVirtualMachine {
    const i_: IEthereumVirtualMachine = { query, invoke, deploy };

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
            return TsResult.Ok<unknown>(await new Ethers.Contract(to, [methodSignature], signer_.provider).getFunction(methodName)(...methodArgs));
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
    }): Promise<TsResult.Result<Ethers.TransactionReceipt | null, unknown>> {
        try {
            return TsResult.Ok(await (await signer_.sendTransaction({
                from: await signerAddress_(),
                to: to,
                nonce: await generateNonce_(),
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
                data: new Ethers.Interface([methodSignature]).encodeFunctionData(methodName, methodArgs)
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
    }) {
        try {
            return TsResult.Ok<Ethers.TransactionReceipt | null>(await (await signer_.sendTransaction({
                from: await signerAddress_(),
                to: null,
                nonce: await generateNonce_(),
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
                data: `0x${bytecode}`
            })).wait(Number(confirmations)));
        }
        catch (error: unknown) {
            return TsResult.Err<unknown>(error);
        }
    }

    async function signerAddress_(): Promise<string> {
        return await signer_.getAddress();
    }

    async function generateNonce_(): Promise<number> {
        return await signer_.getNonce();
    }

    return i_;
}