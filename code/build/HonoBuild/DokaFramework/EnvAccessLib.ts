import type {Maybe} from "./ErrorHandlerLib.ts";
import {wrap, expect} from "./ErrorHandlerLib.ts";
import {ValueHook} from "./EventBusLib.ts";

export function secret(key: string): Maybe<ValueHook<string>> {
    return wrap(function() {
        const secret: string | undefined = process.env?.[key];
        const secretFound: boolean = !!secret;
        expect(secretFound, "missing secret");
        /**
         * -> Each key in the secret is unique and because secrets cannot be
         *    changed at runtime, this means that a unique tag can be used
         *    for each value hook.
         */
        return ValueHook<string>("secret__" + key, secret!);
    });
}