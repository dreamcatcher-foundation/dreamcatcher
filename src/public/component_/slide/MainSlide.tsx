import type { ReactNode } from "react";
import { useMachine } from "@xstate/react";
import { useMemo } from "react";
import { createMachine as Machine } from "xstate";
import { useState } from "react";
import { setRootRef } from "@component/Root";

export function MainSlide(): ReactNode {
    let [_, setMainSlide] = useMachine(useMemo(() => Machine({
        initial: "",
        states: {

        }
    }), []));
    return <>
        
    </>;
}

export function MainSlideHeroSectionOledContainer(): ReactNode {
    return <>
    
    </>;
}