import type { ContractDeployTransaction } from "ethers";
import { Wallet } from "ethers";
import { Contract } from "ethers";
import { TransactionReceipt } from "ethers";
import { Interface } from "ethers";
import { ContractFactory } from "ethers";
import { Ok } from "@lib/Result"
import { Err } from "@lib/Result";
import { Option } from "@lib/Result";
import { Some } from "@lib/Result";
import { None } from "@lib/Result";

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

export interface Account {
    walletAddress():
        Promise<
            | Ok<string>
            | Err<unknown>
        >;
    generateNonce():
        Promise<
            | Ok<number>
            | Err<unknown>
        >;
    query(args: QueryArgs):
        Promise<
            | Ok<unknown>
            | Err<unknown>
        >;
    call(args: CallArgs):
        Promise<
            | Ok<Option<TransactionReceipt>>
            | Err<unknown>
        >;
    deploy(args: DeploymentArgs | DeploymentArgsWithArgs):
        Promise<
            | Ok<Option<TransactionReceipt>>
            | Err<unknown>
        >;
}

export function Account(_wallet: Wallet): Account {
    return { walletAddress, generateNonce, query, call, deploy };
    async function walletAddress():
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
            let name: string = signature.split(" ")[1].split("(")[0];
            return Ok<unknown>(await contract.getFunction(name)(... args_ ?? []));
        }
        catch (e: unknown) {
            return Err<unknown>(e);
        }
    }
    async function call(args: CallArgs):
        Promise<
            | Ok<Option<TransactionReceipt>>
            | Err<unknown>
        > {
        try {
            let walletAddress_:
                | Ok<string>
                | Err<unknown>
                = await walletAddress();
            if (walletAddress_.err) return walletAddress_;
            let nonce:
                | Ok<number>
                | Err<unknown>
                = await generateNonce();
            if (nonce.err) return nonce;
            let { to, signature, args: args_, gasPrice, gasLimit, value, chainId, confirmations } = args;
            let name: string = signature.split(" ")[1].split("(")[0];
            let maybeReceipt:
                | TransactionReceipt
                | null
                = await (await _wallet.sendTransaction({
                    from: walletAddress_.unwrap(),
                    to: to,
                    nonce: nonce.unwrap(),
                    gasPrice: gasPrice ?? 20000000000n,
                    gasLimit: gasLimit ?? 10000000n,
                    chainId: chainId,
                    value: value ?? 0n,
                    data: new Interface([signature]).encodeFunctionData(name, args_ ?? [])
                })).wait(Number(confirmations ?? 1n));
                if (!maybeReceipt) return Ok<Option<TransactionReceipt>>(None);
                return Ok<Option<TransactionReceipt>>(Some<TransactionReceipt>(maybeReceipt));
        }
        catch (e: unknown) {
            return Err<unknown>(e);
        }
    }
    async function deploy(args: DeploymentArgs | DeploymentArgsWithArgs):
        Promise<
            | Ok<Option<TransactionReceipt>>
            | Err<unknown>
        > {
        try {
            let walletAddress_:
                | Ok<string>
                | Err<unknown>
                = await walletAddress();
            if (walletAddress_.err) return walletAddress_;
            let nonce:
                | Ok<number>
                | Err<unknown>
                = await generateNonce();
            if (nonce.err) return nonce;
            if ("abi" in args) {
                let { bytecode, abi, args: args_, gasPrice, gasLimit, value, chainId, confirmations } = args;
                let factory: ContractFactory = new ContractFactory(abi, bytecode, _wallet);
                let transaction: ContractDeployTransaction = await factory.getDeployTransaction(... args_ ?? []);
                let maybeReceipt:
                    | TransactionReceipt
                    | null
                    = await (await _wallet.sendTransaction({
                        from: walletAddress_.unwrap(),
                        to: null,
                        nonce: nonce.unwrap(),
                        gasPrice: gasPrice ?? 20000000000n,
                        gasLimit: gasLimit ?? 10000000n,
                        chainId: chainId,
                        value: value ?? 0n,
                        data: transaction.data
                    })).wait(Number(confirmations ?? 1n));
                if (!maybeReceipt) return Ok<Option<TransactionReceipt>>(None);
                return Ok<Option<TransactionReceipt>>(Some<TransactionReceipt>(maybeReceipt));
            }
            let { bytecode, gasPrice, gasLimit, value, chainId, confirmations } = args;
            let maybeReceipt:
                | TransactionReceipt
                | null
                = await (await _wallet.sendTransaction({
                    from: walletAddress_.unwrap(),
                    to: null,
                    nonce: nonce.unwrap(),
                    gasPrice: gasPrice ?? 20000000000n,
                    gasLimit: gasLimit ?? 10000000n,
                    chainId: chainId,
                    value: value ?? 0n,
                    data: `0x${bytecode}`
                })).wait(Number(confirmations ?? 1n));
                if (!maybeReceipt) return Ok<Option<TransactionReceipt>>(None);
                return Ok<Option<TransactionReceipt>>(Some<TransactionReceipt>(maybeReceipt));
        }
        catch (e: unknown) {
            return Err<unknown>(e);
        }
    }
}