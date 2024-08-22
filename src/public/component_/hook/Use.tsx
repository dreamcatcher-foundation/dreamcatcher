import type { EffectCallback } from "react";
import { useEffect } from "react";

export function useOnMount(hook: () => Promise<unknown>) {
    return useEffect(() => {
        hook();
    }, []);
}

export function useOnUpdate() {

}

export function useOnUnmount() {

}