import {Ok} from "@lib/Result";
import {Err} from "@lib/Result";
import {Option} from "@lib/Result";
import {TransactionReceipt} from "ethers";
import {Query} from "@component/Query";
import {Call} from "@component/Call";
import * as Client from "@component/Client";

export type MockPrototypeVault
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
        secondsLeftToNextRebalance():
            Promise<
                | Ok<number>
                | Err<"notConnected">
                | Err<"****">
                | Err<unknown>
            >;
        previewMint(assetsIn: number):
            Promise<
                | Ok<number>
                | Err<"notConnected">
                | Err<"****">
                | Err<unknown>
            >;
        previewBurn(supplyIn: number):
            Promise<
                | Ok<number>
                | Err<"notConnected">
                | Err<"****">
                | Err<unknown>
            >;
        quote():
            Promise<
                | Ok<[number, number, number]>
                | Err<"notConnected">
                | Err<"****">
                | Err<unknown>
            >;
        totalAssets():
            Promise<
                | Ok<[number, number, number]>
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
        rebalance():
            Promise<
                | Ok<Option<TransactionReceipt>>
                | Err<"notConnected">
                | Err<unknown>
            >;
        mint(assetsIn: number):
            Promise<
                | Ok<Option<TransactionReceipt>>
                | Err<"notConnected">
                | Err<unknown>
            >;
        burn(supplyIn: number):
            Promise<
                | Ok<Option<TransactionReceipt>>
                | Err<"notConnected">
                | Err<unknown>
            >;
    };

export function MockPrototypeVault(_address: string): MockPrototypeVault {
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
        if (typeof query.unwrap() !== "string") return Err("invalidType");
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
        if (typeof query.unwrap() !== "string") return Err("invalidType");
        return Ok<string>(query.unwrap() as string);
    }
    async function secondsLeftToNextRebalance():
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
                methodSignature: "function secondsLeftToNextRebalance() external view returns (uint256)",
                methodName: "secondsLeftToNextRebalance"
            }));
        if (query.err) return query;
        if (typeof query.unwrap() !== "string") return Err("invalidType");
        return Ok<bigint>(query.unwrap() as bigint);
    }
    async function previewMint(assetsIn: number):
        Promise<
            | Ok<number>
            | Err<"notConnected">
            | Err<"****">
            | Err<unknown>
        > {
        
    }
}