import type {Key} from "../type/evm/Key.ts";

export function Key(_key: string) {
    return _key as Key;
}