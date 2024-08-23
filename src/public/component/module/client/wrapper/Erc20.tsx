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
    async function name() {
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
}