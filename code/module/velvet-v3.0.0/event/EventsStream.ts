import type {EventSubscription} from "fbemitter";
import {EventEmitter} from "fbemitter";

export default class EventsStream {
    private _$emitter: EventEmitter = new EventEmitter();

    public constructor() {}

    public $hook(signature: string, hook: (...items: any[]) => void): EventSubscription {
        return this._$emitter.addListener(signature, hook);
    }

    public $once(signature: string, hook: (...items: any[]) => void): EventSubscription {
        return this._$emitter.once(signature, hook);
    }

    public post(signature: string, ...items: any[]): void {
        return this._$emitter.emit(signature, ...items);
    }
}
 
export type {EventSubscription};