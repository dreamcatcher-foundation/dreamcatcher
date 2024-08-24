import type {TransactionReceipt} from "ethers";
import {Ok} from "@lib/Result";
import {Err} from "@lib/Result";
import {Option} from "@lib/Result";
import {Query} from "@component/Query";
import {Call} from "@component/Call";
import * as Client from "@component/Client";

export type Erc20
    = {
        name(): 
            Promise<
                | Ok<string>
                | Err<"notConnected">
                | Err<"****">
                | Err<unknown>
            >;
        symbol():
            Promise<
                | Ok<string>
                | Err<"notConnected">
                | Err<"****">
                | Err<unknown>
            >;
        decimals():
            Promise<
                | Ok<bigint>
                | Err<"notConnected">
                | Err<"****">
                | Err<unknown>
            >;
        totalSupply():
            Promise<
                | Ok<number>
                | Err<"notConnected">
                | Err<"****">
                | Err<unknown>
            >;
        balanceOf(account: string):
            Promise<
                | Ok<number>
                | Err<"notConnected">
                | Err<"****">
                | Err<unknown>
            >;
        allowance(owner: string, spender: string):
            Promise<
                | Ok<number>
                | Err<"notConnected">
                | Err<"****">
                | Err<unknown>
            >;
        transfer(to: string, amount: number):
            Promise<
                | Ok<Option<TransactionReceipt>>
                | Err<unknown>
            >;
        transferFrom(from: string, to: string, amount: number):
            Promise<
                | Ok<Option<TransactionReceipt>>
                | Err<unknown>
            >;
        approve(spender: string, amount: number):
            Promise<
                | Ok<Option<TransactionReceipt>>
                | Err<unknown>
            >;
    };

export function Erc20(_address: string): Erc20 {
    async function name():
        Promise<
            | Ok<string>
            | Err<"notConnected">
            | Err<"****">
            | Err<unknown>
        > {
        let query:
            | Ok<unknown>
            | Err<"notConnected">
            | Err<unknown> 
            = await Client.query(Query({
                to: _address,
                methodSignature: "function name() external view returns (string)",
                methodName: "name"
            }));
        if (query.err) return query;
        if (typeof query.unwrap() !== "string") return Err("****");
        return Ok<string>(query.unwrap() as string);
    }
    async function symbol():
        Promise<
            | Ok<string>
            | Err<"notConnected">
            | Err<"****">
            | Err<unknown>
        > {
        let query:
            | Ok<unknown>
            | Err<"notConnected">
            | Err<unknown> 
            = await Client.query(Query({
                to: _address,
                methodSignature: "function symbol() external view returns (string)",
                methodName: "symbol"
            }));
        if (query.err) return query;
        if (typeof query.unwrap() !== "string") return Err("****");
        return Ok<string>(query.unwrap() as string);
    }
    async function decimals():
        Promise<
            | Ok<bigint>
            | Err<"notConnected">
            | Err<"****">
            | Err<unknown>
        > {
        let query:
            | Ok<unknown>
            | Err<"notConnected">
            | Err<unknown> 
            = await Client.query(Query({
                to: _address,
                methodSignature: "function decimals() external view returns (uint8)",
                methodName: "decimals"
            }));
        if (query.err) return query;
        if (typeof query.unwrap() !== "bigint") return Err("****");
        return Ok<bigint>(query.unwrap() as bigint);
    }
    async function totalSupply():
        Promise<
            | Ok<number>
            | Err<"notConnected">
            | Err<"****">
            | Err<unknown>
        > {
        let query:
            | Ok<unknown> 
            | Err<"notConnected">
            | Err<unknown> 
            = await Client.query(Query({
                to: _address,
                methodSignature: "function totalSupply() external view returns (uint256)",
                methodName: "totalSupply"
            }));
        if (query.err) return query;
        if (typeof query.unwrap() !== "bigint") return Err("****");
        let decimals_:
            | Ok<bigint>
            | Err<"notConnected">
            | Err<"****">
            | Err<unknown> = await decimals();
        if (decimals_.err) return decimals_;
        let queryAsBigint: bigint = query.unwrap() as bigint;
        let decimalsAsBigint: bigint = decimals_.unwrap() as bigint;
        let queryAsNumber: number = Number(queryAsBigint);
        let decimalsAsNumber: number = Number(decimalsAsBigint);
        let conversion: number = queryAsNumber / 10**decimalsAsNumber;
        return Ok<number>(conversion);
    }
    async function balanceOf(account: string):
        Promise<
            | Ok<number>
            | Err<"notConnected">
            | Err<"****">
            | Err<unknown>
        > {
        let query:
            | Ok<unknown>
            | Err<"notConnected">
            | Err<unknown> 
            = await Client.query(Query({
                to: _address,
                methodSignature: "function balanceOf(address) external view returns (uint256)",
                methodName: "balanceOf",
                methodArgs: [account]
            }));
        if (query.err) return query;
        if (typeof query.unwrap() !== "bigint") return Err("invalidType");
        let decimals_:
            | Ok<bigint>
            | Err<"notConnected">
            | Err<"****">
            | Err<unknown> 
            = await decimals();
        if (decimals_.err) return decimals_;
        let queryAsBigint: bigint = query.unwrap() as bigint;
        let decimalsAsBigint: bigint = decimals_.unwrap() as bigint;
        let queryAsNumber: number = Number(queryAsBigint);
        let decimalsAsNumber: number = Number(decimalsAsBigint);
        let conversion: number = queryAsNumber / 10**decimalsAsNumber;
        return Ok<number>(conversion);
    }
    async function allowance(owner: string, spender: string):
        Promise<
            | Ok<number>
            | Err<"notConnected">
            | Err<"****">
            | Err<unknown>
        > {
        let query:
            | Ok<unknown>
            | Err<"notConnected">
            | Err<unknown> 
            = await Client.query(Query({
                to: _address,
                methodSignature: "function allowance(address, address) external view returns (uint256)",
                methodName: "allowance",
                methodArgs: [owner, spender]
            }));
        if (query.err) return query;
        if (typeof query.unwrap() !== "bigint") return Err("invalidType");
        let decimals_:
            | Ok<bigint>
            | Err<"notConnected">
            | Err<unknown> 
            = await decimals();
        if (decimals_.err) return decimals_;
        let queryAsBigint: bigint = query.unwrap() as bigint;
        let decimalsAsBigint: bigint = decimals_.unwrap() as bigint;
        let queryAsNumber: number = Number(queryAsBigint);
        let decimalsAsNumber: number = Number(decimalsAsBigint);
        let conversion: number = queryAsNumber / 10**decimalsAsNumber;
        return Ok<number>(conversion);
    }
    async function transfer(to: string, amount: number):
        Promise<
            | Ok<Option<TransactionReceipt>>
            | Err<unknown>
        > {
        let decimals_:
            | Ok<bigint>
            | Err<"notConnected">
            | Err<unknown> 
            = await decimals();
        if (decimals_.err) return decimals_;
        let decimalsAsBigint: bigint = decimals_.unwrap() as bigint;
        let decimalsAsNumber: number = Number(decimalsAsBigint);
        let conversion: number = amount * 10**decimalsAsNumber;
        let conversionAsBigint: bigint = BigInt(conversion);
        let receipt:
            | Ok<Option<TransactionReceipt>>
            | Err<unknown> 
            = await Client.call(Call({
                to: _address,
                methodSignature: "function transfer(address, uint256) external",
                methodName: "transfer",
                methodArgs: [to, conversionAsBigint]
            }));
        return receipt;
    }
    async function transferFrom(from: string, to: string, amount: number):
        Promise<
            | Ok<Option<TransactionReceipt>>
            | Err<unknown>
        > {
        let decimals_:
            | Ok<bigint>
            | Err<"notConnected">
            | Err<unknown> 
            = await decimals();
        if (decimals_.err) return decimals_;
        let decimalsAsBigint: bigint = decimals_.unwrap() as bigint;
        let decimalsAsNumber: number = Number(decimalsAsBigint);
        let conversion: number = amount * 10**decimalsAsNumber;
        let conversionAsBigint: bigint = BigInt(conversion);
        let receipt:
            | Ok<Option<TransactionReceipt>>
            | Err<unknown> 
            = await Client.call(Call({
                to: _address,
                methodSignature: "function transferFrom(address, address, uint256) external",
                methodName: "transfer",
                methodArgs: [from, to, conversionAsBigint]
            }));
        return receipt;
    }
    async function approve(spender: string, amount: number):
        Promise<
            | Ok<Option<TransactionReceipt>>
            | Err<unknown>
        > {
        let decimals_:
            | Ok<bigint>
            | Err<"notConnected">
            | Err<unknown> 
            = await decimals();
        if (decimals_.err) return decimals_;
        let decimalsAsBigint: bigint = decimals_.unwrap() as bigint;
        let decimalsAsNumber: number = Number(decimalsAsBigint);
        let conversion: number = amount * 10**decimalsAsNumber;
        let conversionAsBigint: bigint = BigInt(conversion);
        let receipt:
            | Ok<Option<TransactionReceipt>>
            | Err<unknown> 
            = await Client.call(Call({
                to: _address,
                methodSignature: "function approve(address, uint256) external",
                methodName: "approve",
                methodArgs: [spender, conversionAsBigint]
            }));
        return receipt;
    }
    return {name, symbol, decimals, totalSupply, balanceOf, allowance, transfer, transferFrom, approve};
}