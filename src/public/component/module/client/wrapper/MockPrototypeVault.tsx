import type {NotConnectedErr} from "@component/NotConnectedErr";
import type {TypeErr} from "@component/TypeErr";
import {Ok} from "@lib/Result";
import {Err} from "@lib/Result";
import {Option} from "@lib/Result";
import {TransactionReceipt} from "ethers";

export type MockPrototypeVault
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
        secondsLeftToNextRebalance():
            Promise<
                | Ok<number>
                | NotConnectedErr
                | TypeErr
                | Err<unknown>
            >;
        previewMint():
            Promise<
                | Ok<number>
                | NotConnectedErr
                | TypeErr
                | Err<unknown>
            >;
        previewBurn():
            Promise<
                | Ok<number>
                | NotConnectedErr
                | TypeErr
                | Err<unknown>
            >;
        quote():
            Promise<
                | Ok<[number, number, number]>
                | NotConnectedErr
                | TypeErr
                | Err<unknown>
            >;
        totalAssets():
            Promise<
                | Ok<[number, number, number]>
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
        rebalance():
            Promise<
                | Ok<Option<TransactionReceipt>>
                | NotConnectedErr
                | Err<unknown>
            >;
        mint():
            Promise<
                | Ok<Option<TransactionReceipt>>
                | NotConnectedErr
                | Err<unknown>
            >;
        burn():
            Promise<
                | Ok<Option<TransactionReceipt>>
                | NotConnectedErr
                | Err<unknown>
            >;
    };