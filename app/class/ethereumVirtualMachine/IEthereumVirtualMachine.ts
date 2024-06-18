import * as TsResult from "ts-results";
import * as Ethers from "ethers";

export interface IEthereumVirtualMachine {
    query({
        to,
        methodSignature,
        methodName,
        methodArgs}: {
            to: string;
            methodSignature: string;
            methodName: string;
            methodArgs?: unknown[];
    }): Promise<TsResult.Result<unknown, unknown>>;
    invoke({
        to,
        methodSignature,
        methodName,
        methodArgs,
        gasPrice,
        gasLimit,
        value,
        chainId,
        confirmations}: {
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
    }): Promise<TsResult.Result<Ethers.TransactionReceipt | null, unknown>>;
    deploy({
        bytecode,
        abi,
        args,
        gasPrice,
        gasLimit,
        value,
        chainId,
        confirmations}: {
            bytecode: string;
            abi?: string[] | object[];
            args?: unknown[];
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
    }): Promise<TsResult.Result<Ethers.TransactionReceipt | null, unknown>>;
}