import { eventBus } from "./EventBus.ts";

export function Event({ from="global", event="", item=undefined }: { from?: string; event?: string; item?: unknown; }): void {
    return eventBus().questionEventEmitterOf({ node: from }).emit(event, item);
}