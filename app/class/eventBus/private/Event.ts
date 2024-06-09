import type { IEvent } from "./IEvent.ts";


class Event implements IEvent {
    public constructor() {
        this.Event();
    }

    protected async Event(): this {

    }
}

export function Events(): IEvents {


    (function() {

    })();

    return {};
}

import { eventBus } from "./EventBus.ts";

export function event({ from="global", event="", item=undefined }: { from?: string; event?: string; item?: unknown; }): void {
    return eventBus().questionEventEmitterOf({ node: from }).emit(event, item);
}