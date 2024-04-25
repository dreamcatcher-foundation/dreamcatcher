import type {EventSubscription} from "fbemitter";
import {EventEmitter} from "fbemitter";

export type Hook<Type extends any[]> = (...items: Type) => void;

export class EventsFeed<EventsMap extends Record<string, any[]>> {
    private _$emitter: EventEmitter = new EventEmitter();

    public hook<Event extends keyof EventsMap>(event: Event, hook: Hook<EventsMap[Event]>): EventSubscription {
        return this._$emitter.addListener(String(event), hook);
    }

    public once<Event extends keyof EventsMap>(event: Event, hook: Hook<EventsMap[Event]>): EventSubscription {
        return this._$emitter.once(String(event), hook);
    }

    public post<Event extends keyof EventsMap>(event: Event, ...items: EventsMap[Event]): this {
        this._$emitter.emit(String(event), ...items);
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
    private _$feeds: {[address: string]: EventsFeed<EventsMap>};

    public hook<Event extends keyof EventsMap>(to: string, event: Event, hook: Hook<EventsMap[Event]>): EventSubscription {
        let hub = this._$feeds[to];
        if (!hub) {
            hub = new EventsFeed<EventsMap>();
            this._$feeds[to] = hub;
        }
        return this._$feeds[to].hook(event, hook);
    }

    public once<Event extends keyof EventsMap>(to: string, event: Event, hook: Hook<EventsMap[Event]>): EventSubscription {
        let hub = this._$feeds[to];
        if (!hub) {
            hub = new EventsFeed<EventsMap>();
            this._$feeds[to] = hub;
        }
        return this._$feeds[to].once(event, hook);
    }

    public post<Event extends keyof EventsMap>(from: string, event: Event, ...items: EventsMap[Event]): this {
        let hub = this._$feeds[from];
        if (!hub) {
            hub = new EventsFeed<EventsMap>();
            this._$feeds[from] = hub;
        }
        this._$feeds[from].post(event, ...items);
        return this;
    }

    public Queue<Event extends keyof EventsMap>(to: string, event: Event) {
        let hub = this._$feeds[to];
        if (!hub) {
            hub = new EventsFeed<EventsMap>();
            this._$feeds[to] = hub;
        }
        return this._$feeds[to].Queue(event);
    }
}

export class ObservableValue<Type> {
    private _$feed = new EventsFeed<{
        "View": [currentValue: Type];
        "Change": [oldValue: Type, newValue: Type];
    }>();

    public constructor(private _$value: Type) {}

    public get(): Type {
        this._$feed.post("View", structuredClone(this._$value));
        return structuredClone(this._$value);
    }

    public set(value: Type): this {
        const oldValue: Type = structuredClone(this._$value);
        const newValue: Type = structuredClone(value);
        this._$feed.post("Change", oldValue, newValue);
        return this;
    }

    public onView(hook: (currentValue: Type) => void): EventSubscription {
        return this._$feed.hook("View", hook);
    }

    public onChange(hook: (oldValue: Type, newValue: Type) => void): EventSubscription {
        return this._$feed.hook("Change", hook);
    }
}