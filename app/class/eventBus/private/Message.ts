import { eventBus } from "./EventBus.ts";
import { EventSubscription as FbEventSubscription } from "fbemitter";
import * as TsResult from "ts-results";

export async function message<Result>({ to="global", message="", timeout=0n, item=undefined }: { to?: string; message?: string; timeout?: bigint; item?: unknown; }): Promise<TsResult.Option<Result>> {
    return await new Promise(function(resolve): void {
        let success: boolean = false;
        const subscription: FbEventSubscription = eventBus().responseEventEmitterOf({ node: to }).once(message, function(response): void {
            if (!success) {
                success = true;
                resolve(TsResult.Some(response));
                return;
            }
            return;
        });
        eventBus().questionEventEmitterOf({ node: to }).emit(message, item);
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