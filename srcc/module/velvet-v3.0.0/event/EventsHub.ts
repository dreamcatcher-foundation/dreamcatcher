import type {EventSubscription} from "./EventsStream.ts";
import EventsStream from "./EventsStream.ts";
import UniqueTag from "./UniqueTag.ts";

export default class EventsHub {
    private static _feeds: Map<UniqueTag, EventsStream | undefined> = new Map();

    private constructor() {}

    public static feed(tag: UniqueTag): EventsStream {
        if (!EventsHub._feeds.get(tag)) {
            EventsHub._feeds.set(tag, new EventsStream());
        }
        return EventsHub._feeds.get(tag)!;
    }

    public static hook(tag: UniqueTag, signature: string, hook: (...items: any[]) => void): EventSubscription {
        return EventsHub.feed(tag).$hook(signature, hook);
    }

    public static once(tag: UniqueTag, signature: string, hook: (...items: any[]) => void): EventSubscription {
        return EventsHub.feed(tag).$once(signature, hook);
    }

    public static post(tag: UniqueTag, signature: string, ...items: any[]): void {
        return EventsHub.feed(tag).post(signature, ...items);
    }
}