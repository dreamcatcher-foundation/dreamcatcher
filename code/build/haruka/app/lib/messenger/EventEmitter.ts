import {type EventSubscription, EventEmitter as FbEventEmitter} from "fbemitter";

export type Listener<Args extends any[]> = (...args: Args) => void;

export default class EventEmitter<EventsMap extends Record<string, unknown[]>> {
    private _innerEventEmitter: FbEventEmitter = new FbEventEmitter();

    public hook<EventName extends keyof EventsMap>(eventName: EventName, listener: Listener<EventsMap[EventName]>): EventSubscription {
        return this._innerEventEmitter.addListener(String(eventName), listener);
    }

    public once<EventName extends keyof EventsMap>(eventName: EventName, listener: Listener<EventsMap[EventName]>): EventSubscription {
        return this._innerEventEmitter.once(String(eventName), listener);
    }

    public post<EventName extends keyof EventsMap>(eventName: EventName, ...args: EventsMap[EventName]): void {
        return this._innerEventEmitter.emit(String(eventName), ...args);
    }
}