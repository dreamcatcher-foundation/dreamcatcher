import { ethers as Ethers } from "ethers";
import * as TsResult from "ts-results";

export class EthereumVirtualMachine {
    private _signer: Ethers.Wallet;

    public constructor({ signer }: { signer: Ethers.Wallet }) {
        this._signer = signer;
    }

    public async signerAddress(): Promise<string> {
        return await this._signer.getAddress();
    }

    public async generateNonce(): Promise<number> {
        return await this._signer.getNonce();
    }

    public async query({
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
            return new TsResult.Ok<unknown>(new Ethers.Contract(to, [methodSignature], this._signer.provider)
                .getFunction(methodName)(...methodArgs));
        }
        catch (error: unknown) {
            return new TsResult.Err<unknown>(error);
        }
    }

    public async invoke({
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
            return new TsResult.Ok(await (await this._signer.sendTransaction({
                from: await this.signerAddress(),
                to: to,
                nonce: await this.generateNonce(),
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
            })).wait(Number(confirmations)));
        }
        catch (error: unknown) {
            return new TsResult.Err<unknown>(error);
        }
    }

    public async deploy({
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
            return new TsResult.Ok<Ethers.TransactionReceipt | null>(await (await this._signer.sendTransaction({
                from: await this.signerAddress(),
                to: null,
                nonce: await this.generateNonce(),
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