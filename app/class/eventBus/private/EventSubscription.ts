import type { ISubscription } from "./ISubscription.ts";
import { EventSubscription as FbEventSubscription } from "fbemitter";
import { eventBus } from "./EventBus.ts";

export function EventSubscription({
    from="public", 
    event="", 
    handler, 
    once=false}: {
        from?: string; 
        event?: string; 
        handler<Item>(item?: Item): void; 
        once?: boolean;
}): ISubscription {
    let _subscription: FbEventSubscription;

    (function() {
        _subscription = !once
            ? eventBus().questionEventEmitterOf(from).addListener(event, handler)
            : eventBus().questionEventEmitterOf(from).once(event, handler);
    })();

    const remove = (): void => _subscription.remove();

    return { remove }
}