import React, {type ReactNode, type CSSProperties} from "react";
import PhantomSteelHorizontalLine from "../PhantomSteelHorizontalLine.tsx";
import {animated, useSpring} from "react-spring";

export interface PulseProps  {
    delay?: number;
    reverse?: boolean;
    style?: CSSProperties;
}

export default function Pulse(_props: PulseProps): ReactNode {
    const {delay, reverse, style} = _props;
    return (
        <PhantomSteelHorizontalLine
        style={style ?? {}}>
            <animated.div
            style={{
                ...useSpring({
                    from: {
                        left: reverse ?? false ? "-10%" : "110%"
                    }, 
                    to: {
                        left: reverse ?? false ? "110%" : "-10%"
                    }, 
                    delay: delay, 
                    config: {
                        tension: 5, 
                        friction: 4
                    }, 
                    loop: true
                }),
                ...{
                    width: "40px",
                    height: "2.5px",
                    bottom: "1.25px",
                    background: `linear-gradient(${reverse ?? false ? "to right" : "to left"}, transparent, rgba(163, 163, 163, 0.25))`,
                    borderRadius: "25px",
                    position: "relative"
                }
            }}/>
        </PhantomSteelHorizontalLine>
    );
}