import type {EventSubscription} from "./EventsStream.ts";
import EventsHub from "./EventsHub.ts";
import UniqueTag from "./UniqueTag.ts";
import EventsStreamQueue from "./EventsStreamQueue.ts";
import Tags from "./Tags.ts";

export default class Dock {
    public constructor(private _tag: UniqueTag) {}

    public $accept(signature: string, hook: (...items: any[]) => void): EventSubscription {
        return EventsHub.$hook(this._tag, signature, hook);
    }

    public $acceptGlobal(signature: string, hook: (...items: any[]) => void): EventSubscription {
        return EventsHub.$hook(Tags.global(), signature, hook);
    }

    public $acceptErrors(signature: string, hook: (...items: any[]) => void): EventSubscription {
        return EventsHub.$hook(Tags.errors(), signature, hook);
    }

    public $acceptEvents(signature: string, hook: (...items: any[]) => void): EventSubscription {
        return EventsHub.$hook(Tags.events(), signature, hook);
    }

    public $queue(signature: string): EventsStreamQueue {
        return new EventsStreamQueue(EventsHub.$feed(this._tag), signature);
    }

    public $queueGlobal(signature: string): EventsStreamQueue {
        return new EventsStreamQueue(EventsHub.$feed(Tags.global()), signature);
    }

    public $queueErrors(signature: string): EventsStreamQueue {
        return new EventsStreamQueue(EventsHub.$feed(Tags.errors()), signature);
    }

    public $queueEvents(signature: string): EventsStreamQueue {
        return new EventsStreamQueue(EventsHub.$feed(Tags.events()), signature);
    }
}