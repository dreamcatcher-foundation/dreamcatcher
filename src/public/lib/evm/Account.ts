import type { ContractDeployTransaction } from "ethers";
import { Wallet } from "ethers";
import { Contract } from "ethers";
import { TransactionReceipt } from "ethers";
import { Interface } from "ethers";
import { ContractFactory } from "ethers";
import { Ok } from "@lib/Result"
import { Err } from "@lib/Result";

export interface QueryArgs {
    to: string;
    signature: string;
    args?: unknown[];
}

export function QueryArgs(_: QueryArgs): QueryArgs {
    return _;
}

export interface CallArgs {
    to: string;
    signature: string;
    args?: unknown[];
    gasPrice?: bigint;
    gasLimit?: bigint;
    value?: bigint;
    chainId?: bigint;
    confirmations?: bigint;
}

export function CallArgs(_: CallArgs): CallArgs {
    return _;
}

export interface DeploymentArgs {
    bytecode: string;
    gasPrice?: bigint;
    gasLimit?: bigint;
    value?: bigint;
    chainId?: bigint;
    confirmations?: bigint;
}

export function DeploymentArgs(_: DeploymentArgs): DeploymentArgs {
    return _;
}

export interface DeploymentArgsWithArgs {
    bytecode: string;
    abi: object[];
    args?: unknown[];
    gasPrice?: bigint;
    gasLimit?: bigint;
    value?: bigint;
    chainId?: bigint;
    confirmations?: bigint;
}

export function DeploymentArgsWithArgs(_: DeploymentArgsWithArgs): DeploymentArgsWithArgs {
    return _;
}

interface Account {

}

export function Account(_wallet: Wallet): Account {
    function wallet(): Wallet {
        return _wallet;
    }
    async function signerAddress():
        Promise<
            | Ok<string>
            | Err<unknown>
        > {
        try {
            return Ok<string>(await _wallet.getAddress());
        }
        catch (e: unknown) {
            return Err<unknown>(e);
        }
    }
    async function generateNonce():
        Promise<
            | Ok<number>
            | Err<unknown>
        > {
        try {
            return Ok<number>(await _wallet.getNonce());
        }
        catch (e: unknown) {
            return Err<unknown>(e);
        }
    }
    async function query(args: QueryArgs):
        Promise<
            | Ok<unknown>
            | Err<unknown>
        > {
        try {
            let { to, signature, args: args_ } = args;
            let contract: Contract = new Contract(to, [signature], _wallet);
            let name: string = signature.split(" ")[1];
            return Ok<unknown>(await contract.getFunction(name)(... args_ ?? []));
        }
        catch (e: unknown) {
            return Err<unknown>(e);
        }
    }
}