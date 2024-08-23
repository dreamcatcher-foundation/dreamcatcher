import type {SessionConstructorResult} from "@component/SessionConstructorResult";
import type {ContractDeployTransaction} from "ethers";
import {Ok} from "@lib/Result";
import {Err} from "@lib/Result";
import {Option} from "@lib/Result"
import {Some} from "@lib/Result";
import {None} from "@lib/Result";
import {Query} from "@component/Query"
import {Call} from "@component/Call";
import {Deployment} from "@component/Deployment";
import {BrowserProvider} from "ethers";
import {TransactionReceipt} from "ethers";
import {ContractFactory} from "ethers";
import {Contract} from "ethers";
import {JsonRpcSigner} from "ethers";
import {Interface} from "ethers";

export type Session
    = {
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
        query(query: Query):
            Promise<
                | Ok<unknown>
                | Err<unknown>
            >;
        call(call: Call):
            Promise<
                | Ok<Option<TransactionReceipt>>
                | Err<unknown>
            >;
        deploy(deployment: Deployment):
            Promise<
                | Ok<Option<TransactionReceipt>>
                | Err<unknown>
            >;
    };

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
    async function query(query: Query):
        Promise<
            | Ok<unknown>
            | Err<unknown>
        > {
        try {
            let { to, methodSignature, methodName, methodArgs } = query;
            let contract: Contract = new Contract(to, [methodSignature], _provider);
            let response: unknown = await contract.getFunction(methodName)(... methodArgs ?? []);
            return Ok<unknown>(response);
        }
        catch (e: unknown) {
            return Err<unknown>(e);
        }
    }
    async function call(call: Call):
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
            let { to, methodSignature, methodName, methodArgs, gasPrice, gasLimit, value, chainId, confirmations } = call;
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
                    data: new Interface([methodSignature]).encodeFunctionData(methodName, methodArgs ?? [])
                })).wait(Number(confirmations ?? 1n));
            if (!maybeReceipt) return Ok<Option<TransactionReceipt>>(None);
            return Ok<Option<TransactionReceipt>>(Some<TransactionReceipt>(maybeReceipt));
        }
        catch (e: unknown) {
            return Err<unknown>(e);
        }
    }
    async function deploy(deployment: Deployment):
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
            if ("abi" in deployment) {
                let { bytecode, abi, args: args_, gasPrice, gasLimit, value, chainId, confirmations } = deployment;
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
            let { bytecode, gasPrice, gasLimit, value, chainId, confirmations } = deployment;
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
    return Ok<Session>({chainId, signerAddress, generateNonce, query, call, deploy});
}