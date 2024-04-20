import {Maybe} from "../type/error/maybe/Maybe.ts";
import {wrap, expect} from "../util/ErrorHandlerLib.ts";
import {JsonRpcProvider} from "ethers";

function InternalProviderNode() {
    let _provider: JsonRpcProvider | null = null;
    let _key: string | null = null;

    function connect(url: string) {
        _provider = new JsonRpcProvider(url);
    }

    function call() {
        
    }
}

let _provider: JsonRpcProvider | null = null;
let _key: string | null;

export function connect(url: string) {

}

export function disconnect() {
    _provider = null;
}

export function useKey(key: string) {

}

export function useEnvVarKey(envKey: string) {}

