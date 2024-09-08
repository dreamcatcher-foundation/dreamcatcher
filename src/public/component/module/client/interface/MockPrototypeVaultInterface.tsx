import { TransactionReceipt } from "@component/Client";
import { query } from "@component/Client";
import { call } from "@component/Client";
import { Erc20Interface } from "./Erc20Interface";

export type MockPrototypeVaultInterface
    = {
        name(): Promise<string>;
        symbol(): Promise<string>;
        secondsLeftToNextRebalance(): Promise<bigint>;
        previewMint(assetsIn: number): Promise<number>;
        previewBurn(supplyIn: number): Promise<number>;
        quote(): Promise<[number, number, number]>;
        totalAssets(): Promise<[number, number, number]>;
        totalSupply(): Promise<number>;
        rebalance(): Promise<TransactionReceipt | null>;
        mint(assetsIn: number): Promise<TransactionReceipt | null>;
        burn(supplyIn: number): Promise<TransactionReceipt | null>;
    };

export function MockPrototypeVaultInterface(_address: string): MockPrototypeVaultInterface {

    async function name(): Promise<string> {
        return ((await query({
            to: _address,
            methodSignature: "function name() external view returns (string)",
            methodName: "name"
        })) as string);
    }

    async function symbol(): Promise<string> {
        return await query({
            to: _address,
            methodSignature: "function symbol() external view returns (string)",
            methodName: "symbol"
        }) as string;
    }

    async function secondsLeftToNextRebalance(): Promise<bigint> {
        return (await query({
            to: _address,
            methodSignature: "function secondsLeftToNextRebalance() external view returns (uint256)",
            methodName: "secondsLeftToNextRebalance"
        })) as bigint;
    }

    async function previewMint(assetsIn: number): Promise<number> {
        return Number((await query({
            to: _address,
            methodSignature: "function previewMint(uint256) external view returns (uint256)",
            methodName: "previewMint",
            methodArgs: [BigInt(assetsIn * 10**18)]
        }) as bigint)) / 10**18;
    }

    async function previewBurn(supplyIn: number): Promise<number> {
        return Number((await query({
            to: _address,
            methodSignature: "function previewBurn(uint256) external view returns (uint256)",
            methodName: "previewBurn",
            methodArgs: [BigInt(supplyIn * 10**18)]
        }) as bigint)) / 10**18;
    }

    async function quote(): Promise<[number, number, number]> {
        let x: [bigint, bigint, bigint] = await query({
            to: _address,
            methodSignature: "function quote() external view returns (uint256, uint256, uint256)",
            methodName: "quote"
        }) as [bigint, bigint, bigint];
        let real: number = Number(x[0]) / 10**18;
        let best: number = Number(x[1]) / 10**18;
        let slippage: number = Number(x[2]) / 10**18;
        return [real, best, slippage];
    }

    async function totalAssets(): Promise<[number, number, number]> {
        let x: [bigint, bigint, bigint] = await query({
            to: _address,
            methodSignature: "function totalAssets() external view returns (uint256, uint256, uint256)",
            methodName: "totalAssets"
        }) as [bigint, bigint, bigint];
        let real: number = Number(x[0]) / 10**18;
        let best: number = Number(x[1]) / 10**18;
        let slippage: number = Number(x[2]) / 10**18;
        return [real, best, slippage];
    }

    async function totalSupply(): Promise<number> {
        return Number((await query({
            to: _address,
            methodSignature: "function totalSupply() external view returns (uint256)",
            methodName: "totalSupply"
        }) as bigint)) / 10**18;
    }

    async function rebalance(): Promise<TransactionReceipt | null> {
        return (await call({
            to: _address,
            methodSignature: "function rebalance() external",
            methodName: "rebalance"
        }));
    }

    async function mint(assetsIn: number): Promise<TransactionReceipt | null> {
        let usdc = Erc20Interface("0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359");
        /// if transaction is replaced the approval transaction is lost and the
        /// chain is broken. a better system needs to be put in place, likely a
        /// global transaction handler.
        let approval = await usdc.approve(_address, assetsIn);
        return (await call({
            to: _address,
            methodSignature: "function mint(uint256) external",
            methodName: "mint",
            methodArgs: [BigInt(assetsIn * 10**18)]
        }));
    }

    async function burn(supplyIn: number): Promise<TransactionReceipt | null> {
        return (await call({
            to: _address,
            methodSignature: "function burn(uint256) external",
            methodName: "burn",
            methodArgs: [BigInt(supplyIn * 10**18)]
        }));
    }    

    return { name, symbol, secondsLeftToNextRebalance, previewMint, previewBurn, quote, totalAssets, totalSupply, rebalance, mint, burn };
}