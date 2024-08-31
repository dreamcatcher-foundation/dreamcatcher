import type { ContractMethod } from "ethers";
import { BrowserProvider } from "ethers";
import { Network as EthersNetwork } from "ethers";
import { JsonRpcSigner } from "ethers";
import { Contract } from "ethers";
import { ContractFactory } from "ethers";
import { Interface } from "ethers";
import { TransactionReceipt } from "ethers";
import { require } from "@lib/ErrorHandler";

export type ClientErrorCode
    =
    | "session-missing-window"
    | "session-missing-provider"
    | "session-missing-accounts"
    | "client-not-connected";

let _session:
    | Session
    | null; 

export type Account
    = {
        address(): Promise<string>;
        nonce(): Promise<number>;
        nextNonce(): Promise<number>;
        query({ to, methodSignature, methodName, methodArgs }: { to: string; methodSignature: string; methodName: string; methodArgs?: unknown[]; }): Promise<unknown>;
        call({ to, methodSignature, methodName, methodArgs, gasPrice, gasLimit, value, chainId, confirmations }: { to: string; methodSignature: string; methodName: string; methodArgs?: unknown[]; gasPrice?: bigint; gasLimit?: bigint; value?: bigint; chainId?: bigint; confirmations?: bigint; }): Promise<TransactionReceipt | null>;
        deployRawBytecode({ bytecode, gasPrice, gasLimit, value, chainId, confirmations }: { bytecode: string; gasPrice?: bigint; gasLimit?: bigint; value?: bigint; chainId?: bigint; confirmations?: bigint; }): Promise<TransactionReceipt | null>;
        deploy({ bytecode, abi, args, gasPrice, gasLimit, value, chainId, confirmations }: { bytecode: string; abi: object[]; args?: unknown[]; gasPrice?: bigint; gasLimit?: bigint; value?: bigint; chainId?: bigint; confirmations?: bigint; }): Promise<TransactionReceipt | null>;
    };

export type Network
    = {
        chainId(): bigint;
    };

export type Session
    = {
        Account(): Promise<Account>;
        Network(): Promise<Network>;
    };

export async function Session(): Promise<Session> {
    let _provider: BrowserProvider;
    let _accounts: string[];
    let _ethereum: unknown = (window as any).ethereum;
    require<ClientErrorCode>(!!window, "session-missing-window");
    require<ClientErrorCode>(!!_ethereum, "session-missing-provider");
    _provider = new BrowserProvider(_ethereum as any);
    _accounts = [];
    if (_accounts.length === 0) await _provider.send("eth_accounts", []);
    if (_accounts.length === 0) await _provider.send("eth_requestAccounts", []);

    async function Account(): Promise<Account> {
        let _account: JsonRpcSigner = await _provider.getSigner();

        async function address(): Promise<string> {
            return await _account.getAddress()
        }

        async function nonce(): Promise<number> {
            return await nextNonce() - 1;
        }

        async function nextNonce(): Promise<number> {
            return await _account.getNonce();
        }

        async function query({ to, methodSignature, methodName, methodArgs = [] }: { to: string; methodSignature: string; methodName: string; methodArgs?: unknown[]; }): Promise<unknown> {
            let contract: Contract = new Contract(to, [methodSignature], _provider);
            let contractMethod: ContractMethod = contract.getFunction(methodName);
            return await contractMethod(... methodArgs);
        }

        async function call({ to, methodSignature, methodName, methodArgs, gasPrice = 20000000000n, gasLimit = 10000000n, value = 0n, chainId, confirmations = 1n }: { to: string; methodSignature: string; methodName: string; methodArgs?: unknown[]; gasPrice?: bigint; gasLimit?: bigint; value?: bigint; chainId?: bigint; confirmations?: bigint; }): Promise<TransactionReceipt | null> {
            return await (await _account.sendTransaction({
                from: await address(),
                to: to,
                nonce: await nextNonce(),
                gasPrice: gasPrice,
                gasLimit: gasLimit,
                chainId: chainId,
                value: value,
                data: new Interface([methodSignature]).encodeFunctionData(methodName, methodArgs)
            })).wait(Number(confirmations));
        }

        async function deployRawBytecode({ bytecode, gasPrice = 20000000000n, gasLimit = 10000000n, value = 0n, chainId, confirmations = 1n }: { bytecode: string; gasPrice?: bigint; gasLimit?: bigint; value?: bigint; chainId?: bigint; confirmations?: bigint; }): Promise<TransactionReceipt | null> {
            return await (await _account.sendTransaction({
                from: await address(),
                to: null,
                nonce: await nextNonce(),
                gasPrice: gasPrice,
                gasLimit: gasLimit,
                chainId: chainId,
                value: value,
                data: bytecode.startsWith("0x") ? bytecode : `0x${ bytecode }`
            })).wait(Number(confirmations));
        }

        async function deploy({ bytecode, abi = [], args = [], gasPrice = 20000000000n, gasLimit = 10000000n, value = 0n, chainId, confirmations = 1n }: { bytecode: string; abi: object[]; args?: unknown[]; gasPrice?: bigint; gasLimit?: bigint; value?: bigint; chainId?: bigint; confirmations?: bigint; }): Promise<TransactionReceipt | null> {
            return await (await _account.sendTransaction({
                from: await address(),
                to: null,
                nonce: await nextNonce(),
                gasPrice: gasPrice,
                gasLimit: gasLimit,
                chainId: chainId,
                value: value,
                data: 
                    (await new ContractFactory(abi, bytecode, _account)
                        .getDeployTransaction(... args))
                        .data
            })).wait(Number(confirmations));
        }

        return { address, nonce, nextNonce, query, call, deployRawBytecode, deploy };
    }

    async function Network() {
        let _network: EthersNetwork = await _provider.getNetwork();

        function chainId(): bigint {
            return _network.chainId;
        }

        return { chainId };
    }

    return { Account, Network };
}


export function connected(): boolean {
    return !!_session;
}

export async function connect() {
    return _session = await Session();
}

export function disconnect() {
    return _session = null;
}

export async function accountAddress() {
    require<ClientErrorCode>(connected(), "client-not-connected");
    let account: Account = await _session!.Account();
    return await account.address();
}

export async function accountChainId() {
    require<ClientErrorCode>(connected(), "client-not-connected");
    let network: Network = await _session!.Network();
    return network.chainId();
}

export async function query({ to, methodSignature, methodName, methodArgs }: { to: string; methodSignature: string; methodName: string; methodArgs?: unknown[]; }) {
    require<ClientErrorCode>(connected(), "client-not-connected");
    return await (await _session!.Account()).query({
        to: to,
        methodSignature: methodSignature,
        methodName: methodName,
        methodArgs: methodArgs
    });
}

export async function call({ to, methodSignature, methodName, methodArgs, gasPrice, gasLimit, value, chainId, confirmations }: { to: string; methodSignature: string; methodName: string; methodArgs?: unknown[]; gasPrice?: bigint; gasLimit?: bigint; value?: bigint; chainId?: bigint; confirmations?: bigint; }) {
    require<ClientErrorCode>(connected(), "client-not-connected");
    return await (await _session!.Account()).call({
        to: to,
        methodSignature: methodSignature,
        methodName: methodName,
        methodArgs: methodArgs,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        value: value,
        chainId: chainId,
        confirmations: confirmations
    });
}

export async function deployRawBytecode({ bytecode, gasPrice, gasLimit, value, chainId, confirmations }: { bytecode: string; gasPrice?: bigint; gasLimit?: bigint; value?: bigint; chainId?: bigint; confirmations?: bigint; }) {
    require<ClientErrorCode>(connected(), "client-not-connected");
    return await (await _session!.Account()).deployRawBytecode({
        bytecode: bytecode,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        value: value,
        chainId: chainId,
        confirmations: confirmations
    });
}

export async function deploy({ bytecode, abi, args, gasPrice, gasLimit, value, chainId, confirmations }: { bytecode: string; abi: object[]; args?: unknown[]; gasPrice?: bigint; gasLimit?: bigint; value?: bigint; chainId?: bigint; confirmations?: bigint; }) {
    require<ClientErrorCode>(connected(), "client-not-connected");
    return await (await _session!.Account()).deploy({
        bytecode: bytecode,
        abi: abi,
        args: args,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        value: value,
        chainId: chainId,
        confirmations: confirmations
    });
}

export { TransactionReceipt };