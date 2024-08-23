import type {NotConnectedErr} from "@component/NotConnectedErr";
import type {TypeErr} from "@component/TypeErr";
import {Ok} from "@lib/Result";
import {Err} from "@lib/Result";
import {Option} from "@lib/Result";
import {TransactionReceipt} from "ethers";
import {Query} from "@component/Query";
import {Call} from "@component/Call";
import * as Client from "@component/Client";

export type Erc20
    = {
        name():
            Promise<
                | Ok<string>
                | NotConnectedErr
                | TypeErr
                | Err<unknown>
            >;
        symbol():
            Promise<
                | Ok<string>
                | NotConnectedErr
                | TypeErr
                | Err<unknown>
            >;
        decimals():
            Promise<
                | Ok<bigint>
                | NotConnectedErr
                | TypeErr
                | Err<unknown>
            >;
        totalSupply():
            Promise<
                | Ok<number>
                | NotConnectedErr
                | TypeErr
                | Err<unknown>
            >;
        balanceOf(account: string):
            Promise<
                | Ok<number>
                | NotConnectedErr
                | TypeErr
                | Err<unknown>
            >;
        allowance(owner: string, spender: string):
            Promise<
                | Ok<number>
                | NotConnectedErr
                | TypeErr
                | Err<unknown>
            >;
        transfer(to: string, amount: number):
            Promise<
                | Ok<Option<TransactionReceipt>>
                | NotConnectedErr
                | Err<unknown>
            >;
        transferFrom(from: string, to: string, amount: number):
            Promise<
                | Ok<Option<TransactionReceipt>>
                | NotConnectedErr
                | Err<unknown>
            >;
        approve(spender: string, amount: number):
            Promise<
                | Ok<Option<TransactionReceipt>>
                | NotConnectedErr
                | Err<unknown>
            >; 
    };

export function Erc20(_address: string): Erc20 {
    async function name():
        Promise<
            | Ok<string>
            | NotConnectedErr
            | TypeErr
            | Err<unknown>
        > {
        let query:
            | Ok<unknown>
            | NotConnectedErr
            | Err<unknown> 
            = await Client.query(Query({
                to: _address,
                methodSignature: "function name() external view returns (string)",
                methodName: "name"
            }));
        if (query.err) return query;
        if (typeof query.unwrap() !== "string") return Err("invalidType");
        return Ok<string>(query.unwrap() as string);
    }
    async function symbol():
        Promise<
            | Ok<string>
            | NotConnectedErr
            | TypeErr
            | Err<unknown>
        > {
        let query:
            | Ok<unknown>
            | NotConnectedErr
            | Err<unknown> 
            = await Client.query(Query({
                to: _address,
                methodSignature: "function symbol() external view returns (string)",
                methodName: "symbol"
            }));
        if (query.err) return query;
        if (typeof query.unwrap() !== "string") return Err("invalidType");
        return Ok<string>(query.unwrap() as string);
    }
    async function decimals():
        Promise<
            | Ok<bigint>
            | NotConnectedErr
            | TypeErr
            | Err<unknown>    
        > {
        let query:
            | Ok<unknown>
            | NotConnectedErr
            | Err<unknown>
            = await Client.query(Query({
                to: _address,
                methodSignature: "function decimals() external view returns (uint8)",
                methodName: "decimals"
            }));
        if (query.err) return query;
        if (typeof query.unwrap() !== "bigint") return Err("invalidType");
        return Ok<bigint>(query.unwrap() as bigint);
    }
    async function totalSupply():
        Promise<
            | Ok<number>
            | NotConnectedErr
            | TypeErr
            | Err<unknown>
        > {
        let query:
            | Ok<unknown>
            | NotConnectedErr
            | Err<unknown>
            = await Client.query(Query({
                to: _address,
                methodSignature: "function totalSupply() external view returns (uint256)",
                methodName: "totalSupply"
            }));
        if (query.err) return query;
        if (typeof query.unwrap() !== "bigint") return Err("invalidType");
        let decimals_:
            | Ok<bigint>
            | NotConnectedErr
            | TypeErr
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
    async function balanceOf(account: string):
        Promise<
            | Ok<number>
            | NotConnectedErr
            | TypeErr
            | Err<unknown>
        > {
        let query:
            | Ok<unknown>
            | NotConnectedErr
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
            | NotConnectedErr
            | TypeErr
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

    return {name, symbol, decimals, totalSupply, balanceOf};
}