import type { EventSubscription } from "fbemitter";
import type { OnSetRefListener } from "@lib/Ref";
import { Ref } from "@lib/Ref";

export type Key
    =
    | string
    | number
    | bigint;

export interface RefMap<T> {
    get(key: Key): Ref<T>;
    set(key: Key, value: T): void;
    onSet(key: Key, listener: OnSetRefListener<T>): EventSubscription
}

export function RefMap<T>(_value: T): RefMap<T> {
    let _map: Map<Key, Ref<T> | undefined> = new Map();
    function get(key: Key): Ref<T> {
        let ref:
            | Ref<T>
            | undefined 
            = _map.get(key);
        if (!ref) {
            _map.set(key, Ref<T>(_value));
        }
        return _map.get(key)!;
    }
    function set(key: Key, value: T): void {
        get(key);
        _map.set(key, Ref<T>(value));
        return;
    }
    function onSet(key: Key, listener: OnSetRefListener<T>): EventSubscription {
        return get(key).onSet(listener);
    }
    return { get, set, onSet };
}