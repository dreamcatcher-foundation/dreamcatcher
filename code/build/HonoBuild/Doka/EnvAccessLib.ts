import type {Maybe} from "./ErrorHandlerLib.ts";
import {wrap, expect} from "./ErrorHandlerLib.ts";
import {ValueHook} from "./EventBusLib.ts";

export function secret(key: string): Maybe<ValueHook<string>> {
    return wrap(function() {
        const secret: string | undefined = process.env?.[key];
        const secretFound: boolean = !!secret;
        expect(secretFound, "missing secret");
        return ValueHook<string>("secret__" + key, secret!);
    });
}