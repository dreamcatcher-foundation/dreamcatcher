import type { ISubscription } from "./ISubscription.ts";
import { eventBus } from "./EventBus.ts";
import { EventSubscription as FbEventSubscription } from "fbemitter";

export function MessageSubscription({
    at="public",
    message="",
    handler,
    once=false}: {
        at?: string;
        message?: string;
        handler<Item>(item?: Item): unknown;
        once?: boolean;
}): ISubscription {
    let _subscription: FbEventSubscription;

    (function() {
        _subscription = !once
            ? eventBus().questionEventEmitterOf(at).addListener(message, function(item?: unknown): void {
                return eventBus().responseEventEmitterOf(at).emit(message, handler(item));
            })
            : eventBus().questionEventEmitterOf(at).once(message, function(item?: unknown): void {
                return eventBus().responseEventEmitterOf(at).emit(message, handler(item));
            });
    })();

    const remove = (): void => _subscription.remove();

    return { remove };
}