import { type ISubscription } from "./ISubscription.ts";
import { eventBus } from "./EventBus.ts";
import { EventSubscription as FbEventSubscription } from "fbemitter";

export function MessageSubscription({ at="global", message="", handler, once=false }: { at?: string; message?: string; handler<Item>({ item }: { item?: Item }): unknown; once?: boolean; }): ISubscription {
    let _subscription: FbEventSubscription;
    const _i: ISubscription = { remove };

    (function() {
        _subscription = !once
            ? eventBus().questionEventEmitterOf({ node: at }).addListener(message, function(item?: unknown): void {
                return eventBus().responseEventEmitterOf({ node: at }).emit(message, handler({ item }));
            })
            : eventBus().questionEventEmitterOf({ node: at }).once(message, function(item?: unknown): void {
                return eventBus().responseEventEmitterOf({ node: at }).emit(message, handler({ item }));
            });
    })();

    function remove(): void {
        _subscription.remove();
    }

    return _i;
}