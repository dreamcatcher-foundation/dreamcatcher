import type {Err} from "@lib/Result";

export type SessionConstructorErr
    =
    | Err<"missingWindow">
    | Err<"missingProvider">
    | Err<"missingAccounts">
    | Err<unknown>;