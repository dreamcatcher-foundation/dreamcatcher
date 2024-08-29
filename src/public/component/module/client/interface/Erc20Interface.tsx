import { TransactionReceipt } from "@component/Client";
import { query } from "@component/Client";
import { call } from "@component/Client";

export type Erc20Interface
    = {
        name(): Promise<string>;
        symbol(): Promise<string>;
        decimals(): Promise<bigint>;
        totalSupply(): Promise<number>;
        balanceOf(account: string): Promise<number>;
        allowance(owner: string, spender: string): Promise<number>;
        transfer(to: string, amount: number): Promise<TransactionReceipt | null>;
        transferFrom(from: string, to: string, amount: number): Promise<TransactionReceipt | null>;
        approve(spender: string, amount: number): Promise<TransactionReceipt | null>;
    };

export function Erc20Interface(_address: string): Erc20Interface {

    async function name(): Promise<string> {
        return await query({
            to: _address,
            methodSignature: "function name() external view returns (string)",
            methodName: "name"
        }) as string;
    }

    async function symbol(): Promise<string> {
        return await query({
            to: _address,
            methodSignature: "function symbol() external view returns (string)",
            methodName: "symbol"
        }) as string;
    }

    async function decimals(): Promise<bigint> {
        return await query({
            to: _address,
            methodSignature: "function decimals() external view returns (uint8)",
            methodName: "decimals"
        }) as bigint;
    }

    async function totalSupply(): Promise<number> {
        return Number((await query({
            to: _address,
            methodSignature: "function totalSupply() external view returns (uint256)",
            methodName: "totalSupply"
        }) as bigint)) / 10**Number(await decimals());
    }

    async function balanceOf(account: string): Promise<number> {
        return Number((await query({
            to: _address,
            methodSignature: "function balanceOf(address) external view returns (uint256)",
            methodName: "balanceOf",
            methodArgs: [account]
        }) as bigint)) / 10**Number(await decimals());
    }

    async function allowance(owner: string, spender: string): Promise<number> {
        return Number((await query({
            to: _address,
            methodSignature: "function allowance(address, address) external view returns (uint256)",
            methodName: "allowance",
            methodArgs: [owner, spender]
        }) as bigint)) / 10**Number(await decimals());
    }

    async function transfer(to: string, amount: number): Promise<TransactionReceipt | null> {
        return (await call({
            to: _address,
            methodSignature: "function transfer(address, uint256) external",
            methodName: "transfer",
            methodArgs: [to, BigInt(amount * 10**Number(await decimals()))]
        }));
    }

    async function transferFrom(from: string, to: string, amount: number): Promise<TransactionReceipt | null> {
        return (await call({
            to: _address,
            methodSignature: "function transferFrom(address, address, uint256) external",
            methodName: "transferFrom",
            methodArgs: [from, to, BigInt(amount * 10**Number(await decimals()))]
        }));
    }

    async function approve(spender: string, amount: number): Promise<TransactionReceipt | null> {
        return (await call({
            to: _address,
            methodSignature: "function approve(address, uint256) external",
            methodName: "approve",
            methodArgs: [spender, BigInt(amount * 10**Number(await decimals()))]
        }));
    }

    return { name, symbol, decimals, totalSupply, balanceOf, allowance, transfer, transferFrom, approve };
}