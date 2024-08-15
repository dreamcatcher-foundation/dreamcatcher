import type { ComponentPropsWithRef } from "react"
import { animated } from "react-spring";
import React from "react";

export function useEvent() {
    
}

export type ControlledProps = ComponentPropsWithRef<typeof animated.div> & {}

export type Controller = {
    
}

export function Controller(): Controller {
    function Controlled(props: ControlledProps): React.JSX.Element {
        return <>
        </>;
    }
    return {};
}