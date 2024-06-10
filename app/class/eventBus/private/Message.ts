import { eventBus } from "./EventBus.ts";
import { EventSubscription as FbEventSubscription } from "fbemitter";
import * as TsResult from "ts-results";

export async function message<Result>({
    to="public",
    message="",
    timeout=0n,
    item=undefined}: {
        to?: string;
        message?: string;
        timeout?: bigint;
        item?: unknown;
}): Promise<TsResult.Option<Result>> {
    return await new Promise(function(resolve): void {
        let success: boolean = false;
        const subscription: FbEventSubscription = eventBus().responseEventEmitterOf(to).once(message, (response: unknown) => {
            if (!success) {
                success = true;
                /** @unsafe */
                resolve(TsResult.Some((response as Result)));
                return;
            }
            return;
        });
        eventBus().questionEventEmitterOf(to).emit(message, item);
        setTimeout(function() {
            if (!success) {
                subscription.remove();
                resolve(TsResult.None);
                return;
            }
            return;
        }, Number(timeout));
        return;
    });
}