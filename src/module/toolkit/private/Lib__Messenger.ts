import type {SpringConfig} from "react-spring";
import type {CSSProperties} from "react";
import type {ReactNode} from "react";
import type {EventSubscription} from "fbemitter";
import {EventEmitter as FbEventEmitter} from "fbemitter";

type EventsMap = {
    /** ... Action */
    setSpring: [spring: CSSProperties],
    setSpringConfig: [springConfig: SpringConfig],
    setStyle: [style: CSSProperties],
    setClassName: [className: string],
    push: [component: ReactNode],
    pull: [],
    wipe: [],
    swap: [component: ReactNode],

    /** ... Events */
    CLICK: [],
    MOUSE_ENTER: [],
    MOUSE_LEAVE: []
};

type Listener<Args extends any[]> = (...args: Args) => void;

class EventEmitter<EventsMap extends Record<string, unknown[]>> {
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

class MappedEventEmitter<EventsMap extends Record<string, unknown[]>> {
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

const defaultMappedEventEmitter: MappedEventEmitter<EventsMap> = new MappedEventEmitter<EventsMap>();

export type {EventsMap};
export type {Listener};
export {EventEmitter};
export {MappedEventEmitter};
export {defaultMappedEventEmitter};