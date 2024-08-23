import type {NotConnectedErr} from "@component/NotConnectedErr";
import type {SessionConstructorErr} from "@component/SessionConstructorErr";
import type {SessionConstructorResult} from "@component/SessionConstructorResult";
import {Option} from "@lib/Result";
import {Some} from "@lib/Result";
import {None} from "@lib/Result";
import {Ok} from "@lib/Result";
import {Err} from "@lib/Result";
import {EmptyOk} from "@lib/Result";
import {Session} from "@component/Session";
import {TransactionReceipt} from "ethers";
import {Query} from "@component/Query";
import {Call} from "@component/Call";
import {Deployment} from "@component/Deployment";

let _session: Option<Session> = None;

export function connected(): boolean {
    return _session.some;
}

export async function connect():
    Promise<
        | typeof EmptyOk
        | SessionConstructorErr
    > {
    let session: SessionConstructorResult = await Session();
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
        | NotConnectedErr
        | Err<unknown>
    > {
    if (_session.none) return Err<"notConnected">("notConnected");
    return await _session.unwrap().chainId();
}

export async function signerAddress():
    Promise<
        | Ok<string>
        | NotConnectedErr
        | Err<unknown>
    > {
    if (_session.none) return Err<"notConnected">("notConnected");
    return await _session.unwrap().signerAddress();
}

export async function generateNonce():
    Promise<
        | Ok<number>
        | NotConnectedErr
        | Err<unknown>
    > {
    if (_session.none) return Err<"notConnected">("notConnected");
    return await _session.unwrap().generateNonce();
}

export async function query(query: Query):
    Promise<
        | Ok<unknown>
        | NotConnectedErr
        | Err<unknown>  
    > {
    if (_session.none) return Err<"notConnected">("notConnected");
    return await _session.unwrap().query(query);
}

export async function call(call: Call):
    Promise<
        | Ok<Option<TransactionReceipt>>
        | NotConnectedErr
        | Err<unknown>
    > {
    if (_session.none) return Err<"notConnected">("notConnected");
    return await _session.unwrap().call(call);
}

export async function deploy(deployment: Deployment):
    Promise<
        | Ok<Option<TransactionReceipt>>
        | NotConnectedErr
        | Err<unknown>
    > {
    if (_session.none) return Err<"notConnected">("notConnected");
    return await _session.unwrap().deploy(deployment);
}