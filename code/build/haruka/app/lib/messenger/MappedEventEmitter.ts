import EventEmitter, {type Listener} from "./EventEmitter.ts";
import {type EventSubscription} from "fbemitter";

export default class MappedEventEmitter<EventsMap extends Record<string, unknown[]>> {
    private _eventEmitterMap: Map<string | number, EventEmitter<EventsMap> | undefined> = new Map();

    public eventEmitter(name: string | number): EventEmitter<EventsMap> {
        !this._eventEmitterMap.get(name) && this._eventEmitterMap.set(name, new EventEmitter<EventsMap>());
        return this._eventEmitterMap.get(name)!;
    }

    public hook<EventName extends keyof EventsMap>(atName: string, eventName: EventName, listener: Listener<EventsMap[EventName]>): EventSubscription {
        return this.eventEmitter(atName).hook(eventName, listener);
    }

    public once<EventName extends keyof EventsMap>(atName: string, eventName: EventName, listener: Listener<EventsMap[EventName]>): EventSubscription {
        return this.eventEmitter(atName).once(eventName, listener);
    }

    public post<EventName extends keyof EventsMap>(toName: string, eventName: EventName, ...args: EventsMap[EventName]): void {
        return this.eventEmitter(toName).post(eventName, ...args);
    }

    public hookEvent<EventName extends keyof EventsMap>(fromName: string, eventName: EventName, listener: Listener<EventsMap[EventName]>): EventSubscription {
        return this.hook(fromName, eventName, listener);
    }

    public onceEvent<EventName extends keyof EventsMap>(fromName: string, eventName: EventName, listener: Listener<EventsMap[EventName]>): EventSubscription {
        return this.once(fromName, eventName, listener);
    }

    public postEvent<EventName extends keyof EventsMap>(fromName: string, eventName: EventName, ...args: EventsMap[EventName]): void {
        return this.post(fromName, eventName, ...args);
    }
}