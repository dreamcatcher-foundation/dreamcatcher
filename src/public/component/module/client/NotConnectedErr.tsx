import type {Err} from "@lib/Result";

export type NotConnectedErr
    =
    | Err<"notConnected">;