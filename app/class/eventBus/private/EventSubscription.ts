import { type ISubscription } from "./ISubscription.ts";
import { EventSubscription as FbEventSubscription } from "fbemitter";
import { eventBus } from "./EventBus.ts";

export function EventSubscription({ from="public", event="", handler, once=false }: { from?: string; event?: string; handler<Item>({ item }: { item?: Item }): void; once?: boolean; }): ISubscription {
    let _subscription: FbEventSubscription;
    let _i = { remove };

    (function() {
        _subscription = !once
            ? eventBus().questionEventEmitterOf({ node: from }).addListener(event, handler)
            : eventBus().questionEventEmitterOf({ node: from }).once(event, handler);
    })();

    function remove(): void {
        return _subscription.remove();
    }

    return _i;
}