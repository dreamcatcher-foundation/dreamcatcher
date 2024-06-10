import { eventBus } from "./EventBus.ts";

export function event({ from="global", event="", item=undefined }: { from?: string; event?: string; item?: unknown; }): void {
    return eventBus().questionEventEmitterOf(from).emit(event, item);
}