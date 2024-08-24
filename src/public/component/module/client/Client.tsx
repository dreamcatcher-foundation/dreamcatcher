import {Option} from "@lib/Result";
import {Some} from "@lib/Result";
import {None} from "@lib/Result";
import {Ok} from "@lib/Result";
import {Err} from "@lib/Result";
import {EmptyOk} from "@lib/Result";
import {Session} from "@component/Session";
import {TransactionReceipt} from "ethers";
import {Query} from "@component/module/client/Query";
import {Call} from "@component/module/client/Call";
import {Deployment} from "@component/module/client/Deployment";

let _session: Option<Session> = None;

export function connected(): boolean {
    return _session.some;
}

export async function connect():
    Promise<
        | typeof EmptyOk
        | Err<"missingWindow">
        | Err<"missingProvider">
        | Err<"missingAccounts">
        | Err<unknown>
    > {
    let session:
        | Ok<Session>
        | Err<"missingWindow">
        | Err<"missingProvider">
        | Err<"missingAccounts">
        | Err<unknown>
        = await Session();
    if (session.err) return session;
    _session = Some<Session>(session.unwrap());
    return EmptyOk;
}

export function disconnect(): void {
    _session = None;
    return;
}

export async function chainId():
    Promise<
        | Ok<bigint>
        | Err<"notConnected">
        | Err<unknown>
    > {
    if (_session.none) return Err<"notConnected">("notConnected");
    return await _session.unwrap().chainId();
}

export async function signerAddress():
    Promise<
        | Ok<string>
        | Err<"notConnected">
        | Err<unknown>
    > {
    if (_session.none) return Err<"notConnected">("notConnected");
    return await _session.unwrap().signerAddress();
}

export async function generateNonce():
    Promise<
        | Ok<number>
        | Err<"notConnected">
        | Err<unknown>
    > {
    if (_session.none) return Err<"notConnected">("notConnected");
    return await _session.unwrap().generateNonce();
}

export async function query(query: Query):
    Promise<
        | Ok<unknown>
        | Err<"notConnected">
        | Err<unknown>  
    > {
    if (_session.none) return Err<"notConnected">("notConnected");
    return await _session.unwrap().query(query);
}

export async function call(call: Call):
    Promise<
        | Ok<Option<TransactionReceipt>>
        | Err<"notConnected">
        | Err<unknown>
    > {
    if (_session.none) return Err<"notConnected">("notConnected");
    return await _session.unwrap().call(call);
}

export async function deploy(deployment: Deployment):
    Promise<
        | Ok<Option<TransactionReceipt>>
        | Err<"notConnected">
        | Err<unknown>
    > {
    if (_session.none) return Err<"notConnected">("notConnected");
    return await _session.unwrap().deploy(deployment);
}