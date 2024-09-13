import type {SelectorWithReturn} from "../selector/SelectorWithReturn";
import type {Selector} from "../selector/Selector";
import type {ContractMethod} from "ethers";
import type {TransactionReceipt} from "ethers";
import type {ContractDeployTransaction} from "ethers";
import {Interface} from "ethers";
import {JsonRpcProvider} from "ethers";
import {Wallet} from "ethers";
import {Contract} from "ethers";
import {ContractFactory} from "ethers";
import {Network} from "ethers";
import {Sol} from "../solc/Sol";
import {require}  from "@lib/error/ErrorHandler";

export type VirtualMachineErrorCode =
    | "vm-sol-bytecode-unavailable"
    | "vm-sol-abstract-binary-interface-unavailable"
    | "vm-sol-has-compilation-errors";

export type VirtualMachine = {
    Account(_key: string): Account;
    chainId(): Promise<bigint>;
}

export type Account = {
    address(): Promise<string>;
    nonce(): Promise<number>;
    nextNonce(): Promise<number>;
    query(to: string, selector: SelectorWithReturn, ... args: unknown[]): Promise<unknown>;
    call({
        to,
        selector,
        args,
        gasPrice,
        gasLimit,
        value,
        chainId,
        confirmations
    }: {
        to: string;
        selector: Selector;
        args?: unknown[];
        gasPrice?: bigint;
        gasLimit?: bigint;
        value?: bigint;
        chainId?: bigint;
        confirmations?: bigint;
    }): Promise<TransactionReceipt | null>;
    deploy({
        bytecode,
        abstractBinaryInterface,
        args,
        gasPrice,
        gasLimit,
        value,
        chainId,
        confirmations
    }: {
        bytecode: string;
        abstractBinaryInterface: object[];
        args?: unknown[];
        gasPrice?: bigint;
        gasLimit?: bigint;
        value?: bigint;
        chainId?: bigint;
        confirmations?: bigint;
    }): Promise<TransactionReceipt | null>;
    deploySol({
        sol,
        args,
        gasPrice,
        gasLimit,
        value,
        chainId,
        confirmations
    }: {
        sol: Sol;
        args?: unknown[];
        gasPrice?: bigint;
        gasLimit?: bigint;
        value?: bigint;
        chainId?: bigint;
        confirmations?: bigint;
    }): Promise<TransactionReceipt | null>;
    deployRaw({
        bytecode,
        gasPrice,
        gasLimit,
        value,
        chainId,
        confirmations
    }: {
        bytecode: string;
        gasPrice?: bigint;
        gasLimit?: bigint;
        value?: bigint;
        chainId?: bigint;
        confirmations?: bigint;
    }): Promise<TransactionReceipt | null>;
}

export function VirtualMachine(_url: string): VirtualMachine {
    let _jsonRpcProvider: JsonRpcProvider;

    /** @constructor */ {
        _jsonRpcProvider = new JsonRpcProvider(_url);
        return {Account, chainId};
    }

    function Account(_key: string): Account {
        let _wallet: Wallet;

        /** @constructor */ {
            _wallet = new Wallet(_key, _jsonRpcProvider);
            return {address, nonce, nextNonce, query, call, deploy, deploySol, deployRaw};
        }

        async function address(): Promise<string> {
            return await _wallet.getAddress();
        }

        async function nonce(): Promise<number> {
            return await nextNonce() - 1;
        }

        async function nextNonce(): Promise<number> {
            return await _wallet.getNonce();
        }

        async function query(to: string, selector: SelectorWithReturn, ... args: unknown[]): Promise<unknown> {
            let contract: Contract = new Contract(to, [selector.signature()], _wallet);
            let contractMethod: ContractMethod = contract.getFunction(selector.name());
            return await contractMethod(... args);
        }

        async function call({
            to,
            selector,
            args = [],
            gasPrice = 20000000000n,
            gasLimit = 10000000n,
            value = 0n,
            chainId,
            confirmations = 1n
        }: {
            to: string;
            selector: Selector;
            args?: unknown[];
            gasPrice?: bigint;
            gasLimit?: bigint;
            value?: bigint;
            chainId?: bigint;
            confirmations?: bigint;
        }): Promise<TransactionReceipt | null> {
            return await (await _wallet.sendTransaction({
                from: await address(),
                to: to,
                nonce: await nextNonce(),
                gasPrice: gasPrice,
                gasLimit: gasLimit,
                value: value,
                chainId: chainId,
                data: new Interface([selector.signature()]).encodeFunctionData(selector.name(), args)
            })).wait(Number(confirmations));
        }

        async function deploy({
            bytecode,
            abstractBinaryInterface,
            args = [],
            gasPrice = 20000000000n,
            gasLimit = 10000000n,
            value = 0n,
            chainId,
            confirmations = 1n
        }: {
            bytecode: string;
            abstractBinaryInterface: object[];
            args?: unknown[];
            gasPrice?: bigint;
            gasLimit?: bigint;
            value?: bigint;
            chainId?: bigint;
            confirmations?: bigint;
        }): Promise<TransactionReceipt | null> {
            let factory: ContractFactory = new ContractFactory(abstractBinaryInterface, bytecode, _wallet);
            let transaction: ContractDeployTransaction = await factory.getDeployTransaction(... args);
            return await (await _wallet.sendTransaction({
                from: await address(),
                to: null,
                nonce: await nextNonce(),
                gasPrice: gasPrice ?? 20000000000n,
                gasLimit: gasLimit ?? 10000000n,
                chainId: chainId,
                value: value ?? 0n,
                data: transaction.data
            })).wait(Number(confirmations ?? 1n));
        }

        async function deploySol({
            sol,
            args = [],
            gasPrice = 20000000000n,
            gasLimit = 10000000n,
            value = 0n,
            chainId,
            confirmations = 1n
        }: {
            sol: Sol;
            args?: unknown[];
            gasPrice?: bigint;
            gasLimit?: bigint;
            value?: bigint;
            chainId?: bigint;
            confirmations?: bigint;
        }): Promise<TransactionReceipt | null> {
            require<VirtualMachineErrorCode>(sol.errors().length === 0, "vm-sol-has-compilation-errors");
            require<VirtualMachineErrorCode>(sol.bytecode() !== "", "vm-sol-bytecode-unavailable");
            require<VirtualMachineErrorCode>(sol.abstractBinaryInterface().length !== 0, "vm-sol-abstract-binary-interface-unavailable");
            return await deploy({
                bytecode: sol.bytecode(),
                abstractBinaryInterface: sol.abstractBinaryInterface(),
                args: args,
                gasPrice: gasPrice,
                gasLimit: gasLimit,
                value: value,
                chainId: chainId,
                confirmations: confirmations
            });
        }

        async function deployRaw({
            bytecode,
            gasPrice = 20000000000n,
            gasLimit = 10000000n,
            value = 0n,
            chainId,
            confirmations = 1n
        }: {
            bytecode: string;
            gasPrice?: bigint;
            gasLimit?: bigint;
            value?: bigint;
            chainId?: bigint;
            confirmations?: bigint;
        }): Promise<TransactionReceipt | null> {
            return await (await _wallet.sendTransaction({
                from: await address(),
                to: null,
                nonce: await nextNonce(),
                gasPrice: gasPrice,
                gasLimit: gasLimit,
                value: value,
                chainId: chainId,
                data: "0x" + bytecode
            })).wait(Number(confirmations));
        }
    }

    async function chainId(): Promise<bigint> {
        let network: Network = await _jsonRpcProvider.getNetwork();
        return network.chainId;
    }
}

export {SelectorWithReturn} from "../selector/SelectorWithReturn";
export {Selector} from "../selector/Selector";