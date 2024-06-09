import type {EventSubscription} from "./EventsStream.ts";
import Feed from "./EventsStream.ts";

export default class EventsStreamQueue {
    private _$queue: any[][] = [];
    private _$subscription: EventSubscription;

    public constructor(feed: Feed, signature: string) {
        this._$subscription = feed.$hook(signature, (...items) => this._$queue.push(...items));
    }

    public isEmpty(): boolean {
        return this.length() == 0 ? true : false;
    }

    public length(): number {
        return this._$queue.length;
    }

    public $consume(): any[] {
        return this._$queue.shift() as any[] ?? [];
    }

    public remove(): void {
        return this._$subscription.remove();
    }
}

