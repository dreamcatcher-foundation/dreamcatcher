import type { ComponentPropsWithRef } from "react";
import { animated } from "react-spring";
import React from "react";

export interface ColProps extends ComponentPropsWithRef<typeof animated.div> {}

export function Col(props: ColProps): React.JSX.Element {
    let { style, ... more } = props;
    return <>
        <animated.div
        style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            ... style ?? {}
        }}
        { ... more }/>
    </>;
}