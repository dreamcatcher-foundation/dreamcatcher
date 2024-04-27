import type {EventSubscription} from "fbemitter";
import {EventEmitter} from "fbemitter";

export type Hook<Type extends any[]> = (...items: Type) => void;

export class EventsFeed<EventsMap extends Record<string, any[]>> {
    private _emitter: EventEmitter = new EventEmitter();

    public hook<Event extends keyof EventsMap>(event: Event, hook: Hook<EventsMap[Event]>): EventSubscription {
        return this._emitter.addListener(String(event), hook);
    }

    public once<Event extends keyof EventsMap>(event: Event, hook: Hook<EventsMap[Event]>): EventSubscription {
        return this._emitter.once(String(event), hook);
    }

    public post<Event extends keyof EventsMap>(event: Event, ...items: EventsMap[Event]): this {
        this._emitter.emit(String(event), ...items);
        return this;
    }

    public Queue<Event extends keyof EventsMap>(event: Event) {
        const parent: this = this;
        class Queue {
            private _$queue: EventsMap[Event][] = [];
            private _$subscription: EventSubscription;

            public constructor(event: Event) {
                this._$subscription = parent.hook<Event>(event, (...items) => this._$queue.push(items));
            }

            public isEmpty(): boolean {
                if (this.length() == 0n) {
                    return true;
                }
                return false;
            }

            public length(): bigint {
                return BigInt(this._$queue.length);
            }

            public consume(hook?: Hook<EventsMap[Event]>): EventsMap[Event] | void {
                const maybeItems: EventsMap[Event] | undefined = this._$queue.shift();
                if (!maybeItems) {
                    return;
                }
                const items: EventsMap[Event] = maybeItems;
                if (hook) {
                    hook(...items);
                    return;
                }
                return items;
            }

            public remove(): void {
                return this._$subscription.remove();
            }
        }

        return new Queue(event);
    }
}

export class EventsHub<EventsMap extends Record<string, any[]>> {
    private _feeds: {[address: string]: EventsFeed<EventsMap>} = {};

    public hook<Event extends keyof EventsMap>(remoteId: string, event: Event, hook: Hook<EventsMap[Event]>): EventSubscription {
        let hub = this._feeds[remoteId];
        if (!hub) {
            hub = new EventsFeed<EventsMap>();
            this._feeds[remoteId] = hub;
        }
        return this._feeds[remoteId].hook(event, hook);
    }

    public once<Event extends keyof EventsMap>(remoteId: string, event: Event, hook: Hook<EventsMap[Event]>): EventSubscription {
        let hub = this._feeds[remoteId];
        if (!hub) {
            hub = new EventsFeed<EventsMap>();
            this._feeds[remoteId] = hub;
        }
        return this._feeds[remoteId].once(event, hook);
    }

    public post<Event extends keyof EventsMap>(remoteId: string, event: Event, ...items: EventsMap[Event]): this {
        let hub = this._feeds[remoteId];
        if (!hub) {
            hub = new EventsFeed<EventsMap>();
            this._feeds[remoteId] = hub;
        }
        this._feeds[remoteId].post(event, ...items);
        return this;
    }

    public Queue<Event extends keyof EventsMap>(remoteId: string, event: Event) {
        let hub = this._feeds[remoteId];
        if (!hub) {
            hub = new EventsFeed<EventsMap>();
            this._feeds[remoteId] = hub;
        }
        return this._feeds[remoteId].Queue(event);
    }
}

export class ObservableValue<Type> {
    private _feed = new EventsFeed<{
        "View": [currentValue: Type];
        "Change": [oldValue: Type, newValue: Type];
    }>();

    public constructor(private _$value: Type) {}

    public get(): Type {
        this._feed.post("View", structuredClone(this._$value));
        return structuredClone(this._$value);
    }

    public set(value: Type): this {
        const oldValue: Type = structuredClone(this._$value);
        const newValue: Type = structuredClone(value);
        this._feed.post("Change", oldValue, newValue);
        return this;
    }

    public onView(hook: (currentValue: Type) => void): EventSubscription {
        return this._feed.hook("View", hook);
    }

    public onChange(hook: (oldValue: Type, newValue: Type) => void): EventSubscription {
        return this._feed.hook("Change", hook);
    }
}