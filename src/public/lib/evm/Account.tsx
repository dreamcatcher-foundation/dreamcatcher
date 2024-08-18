import type { ContractDeployTransaction } from "ethers";
import type { JsonRpcSigner } from "ethers";
import type { TransactionReceipt } from "ethers";
import { BrowserProvider } from "ethers";
import { Contract } from "ethers";
import { Interface } from "ethers";
import { ContractFactory } from "ethers";
import { Ok } from "@lib/Result";
import { Err } from "@lib/Result";
import { Option } from "@lib/Result";
import { Some } from "@lib/Result";
import { None } from "@lib/Result";
import { EmptyOk } from "@lib/Result";

let _session: Option<Session> = None;

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

export type SessionConstructorResult
    =
    | Ok<Session>
    | SessionConstructorErr;

export type SessionConstructorErr
    =
    | Err<unknown>
    | Err<"missingWindow">
    | Err<"missingProvider">
    | Err<"missingAccounts">;

export interface Session {
    chainId():
        Promise<
            | Ok<bigint>
            | Err<unknown>
        >;
    signerAddress():
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

export async function Session(): Promise<SessionConstructorResult> {
    let _provider!: BrowserProvider;
    try {
        let ethereum: unknown = (window as any).ethereum;
        if (!window) return Err<"missingWindow">("missingWindow");
        if (!ethereum) return Err<"missingProvider">("missingProvider");
        _provider = new BrowserProvider(ethereum as any);
        let accounts: string[];
        accounts = await _provider.send("eth_accounts", []);
        if (accounts.length === 0) {
            accounts = await _provider.send("eth_requestAccounts", []);
        }
        if (accounts.length === 0) return Err<"missingAccounts">("missingAccounts");
    }
    catch (e: unknown) {
        return Err<unknown>(e);
    }
    return Ok<Session>({ chainId, signerAddress, generateNonce, query, call, deploy });
    async function chainId():
        Promise<
            | Ok<bigint>
            | Err<unknown>
        > {
        try {
            return Ok<bigint>((await _provider.getNetwork()).chainId);
        }
        catch (e: unknown) {
            return Err<unknown>(e);
        }
    }
    async function signerAddress():
        Promise<
            | Ok<string>
            | Err<unknown>
        > {
        try {
            return Ok<string>(await (await _provider.getSigner()).getAddress());
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
            return Ok<number>(await (await _provider.getSigner()).getNonce());
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
            let contract: Contract = new Contract(to, [signature], _provider);
            let name: string = signature.split(" ")[1].split("(")[0];
            let response: unknown = await contract.getFunction(name)(... args_ ?? []);
            return Ok<unknown>(response);
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
            let signer: JsonRpcSigner = await _provider.getSigner();
            let signerAddress_:
                | Ok<string>
                | Err<unknown>
                = await signerAddress();
            if (signerAddress_.err) return signerAddress_;
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
                = await (await signer.sendTransaction({
                    from: signerAddress_.unwrap(),
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
            let signer: JsonRpcSigner = await _provider.getSigner();
            let signerAddress_:
                | Ok<string>
                | Err<unknown>
                = await signerAddress();
            if (signerAddress_.err) return signerAddress_;
            let nonce:
                | Ok<number>
                | Err<unknown>
                = await generateNonce();
            if (nonce.err) return nonce;
            if ("abi" in args) {
                let { bytecode, abi, args: args_, gasPrice, gasLimit, value, chainId, confirmations } = args;
                let factory: ContractFactory = new ContractFactory(abi, bytecode, signer);
                let transaction: ContractDeployTransaction = await factory.getDeployTransaction(... args_ ?? []);
                let maybeReceipt:
                    | TransactionReceipt
                    | null
                    = await (await signer.sendTransaction({
                        from: signerAddress_.unwrap(),
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
                = await (await signer.sendTransaction({
                    from: signerAddress_.unwrap(),
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

export function isConnected(): boolean {
    return _session.some;
}

export type NotConnectedErr
    =
    | Err<"notConnected">;

export async function connect():
    Promise<
        | Ok<void>
        | SessionConstructorErr
    > {
    let session: SessionConstructorResult = await Session();
    if (session.err) return session;
    _session = Some<Session>(session.unwrap());
    return EmptyOk;
}

export function disconnect(): void {
    _session = None;
    return;
}

export async function query(args: QueryArgs):
    Promise<
        | Ok<unknown>
        | NotConnectedErr
        | Err<unknown>
    > {
    if (_session.none) return Err<"notConnected">("notConnected");
    return await _session.unwrap().query(args);
}

export async function call(args: CallArgs):
    Promise<
        | Ok<Option<TransactionReceipt>>
        | NotConnectedErr
        | Err<unknown>
    > {
    if (_session.none) return Err<"notConnected">("notConnected");
    return await _session.unwrap().call(args);
}

export async function deploy(args: DeploymentArgs | DeploymentArgsWithArgs):
    Promise<
        | Ok<Option<TransactionReceipt>>
        | NotConnectedErr
        | Err<unknown>    
    > {
    if (_session.none) return Err<"notConnected">("notConnected");
    return await _session.unwrap().deploy(args);
}

export async function chainId():
    Promise<
        | Ok<bigint>
        | NotConnectedErr
        | Err<unknown>
    > {
    if (_session.none) return Err<"notConnected">("notConnected");
    return await _session.unwrap().chainId();
}

export async function signerAddress():
    Promise<
        | Ok<string>
        | NotConnectedErr
        | Err<unknown>
    > {
    if (_session.none) return Err<"notConnected">("notConnected");
    return await _session.unwrap().signerAddress();
}

export async function generateNonce():
    Promise<
        | Ok<number>
        | NotConnectedErr
        | Err<unknown>
    > {
    if (_session.none) return Err<"notConnected">("notConnected");
    return await _session.unwrap().generateNonce();
}