import type {SelectorWithReturn} from "@doka/SelectorWithReturn";
import type {Selector} from "@doka/Selector";
import type {ContractMethod} from "ethers";
import type {TransactionReceipt} from "ethers";
import type {ContractDeployTransaction} from "ethers";
import {Interface} from "ethers";
import {JsonRpcProvider} from "ethers";
import {Wallet} from "ethers";
import {Contract} from "ethers";
import {ContractFactory} from "ethers";
import {Sol} from "@doka/Sol";
import {require}  from "@lib/error/ErrorHandler";

export function VirtualMachine(_url: string) {
    let _jsonRpcProvider: JsonRpcProvider;

    /***/ {
        _connect(_url);
        return {Account, chainId};
    }

    function Account(key: string) {
        let _wallet: Wallet;

        /***/ {
            _connect(key);
            return {address, nonce, nextNonce, query, call, deploy, deploySol, deployRawBytecode};
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
        }): Promise<TransactionReceipt | null> {
            return await (await _wallet.sendTransaction({
                from: await address(),
                to: to,
                nonce: await nextNonce(),
                gasPrice: gasPrice,
                gasLimit: gasLimit,
                chainId: chainId,
                value: value,
                data: new Interface([selector.signature()]).encodeFunctionData(selector.name(), args)
            })).wait(Number(confirmations));
        }

        async function deploy({
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
        }): Promise<TransactionReceipt | null> {
            let factory: ContractFactory = new ContractFactory(abstractBinaryInterface, bytecode, _wallet);
            let transaction: ContractDeployTransaction = await factory.getDeployTransaction(... args);
            return await (await _wallet.sendTransaction({
                from: await address(),
                to: null,
                nonce: await nextNonce(),
                gasPrice: gasPrice,
                gasLimit: gasLimit,
                chainId: chainId,
                value: value,
                data: transaction.data
            })).wait(Number(confirmations));
        }

        async function deploySol({
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
        }): Promise<TransactionReceipt | null> {
            require(sol.bytecode() !== "");
            require(sol.abstractBinaryInterface().length !== 0);
            require(sol.errors().length !== 0);
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

        async function deployRawBytecode({
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
        }): Promise<TransactionReceipt | null> {
            return await (await _wallet.sendTransaction({
                from: await address(),
                to: null,
                nonce: await nextNonce(),
                gasPrice: gasPrice,
                gasLimit: gasLimit,
                chainId: chainId,
                value: value,
                data: "0x" + bytecode
            })).wait(Number(confirmations));
        }

        function _connect(key: string) {
            require(!!_jsonRpcProvider, "vm-not-connected");
            _wallet = new Wallet(key, _jsonRpcProvider);
            return;
        }
    }

    async function chainId(): Promise<bigint> {
        return (await _jsonRpcProvider.getNetwork()).chainId
    }

    function _connect(url: string): JsonRpcProvider {
        return _jsonRpcProvider = new JsonRpcProvider(url);
    }
}



