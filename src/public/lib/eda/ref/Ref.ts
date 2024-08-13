import { EventSubscription } from "fbemitter";
import { EventEmitter } from "fbemitter";

export type OnSetRefListener<T> = (newValue: T, oldValue: T) => unknown;

export interface Ref<T> {
    get(): T;
    set(value: T): void;
    onSet(listener: OnSetRefListener<T>): EventSubscription;
}

export function Ref<T>(_value: T): Ref<T> {
    let _em: EventEmitter = new EventEmitter();
    return { get, set, onSet };
    function get(): T {
        return _value;
    }
    function set(value: T): void {
        let oldValue: T = get();
        let newValue: T = value;
        _value = value;
        _em.emit("set", newValue, oldValue);
        return;
    }
    function onSet(listener: OnSetRefListener<T>): EventSubscription {
        return _em.addListener("set", listener);
    }
}