import React, {type ReactNode} from "react";
import PulseLine from "./PulseLine.ts";
import Base, {type BaseProps} from "../Base.tsx";
import {animated, useSpring} from "react-spring";

export type PulseProps = BaseProps & {
    delay?: number;
    reverse?: boolean;
};

export default function Pulse(props: PulseProps): ReactNode {
    const {name, delay, reverse, style, ...more} = props;
    const from: string = reverse 
        ? "110%" 
        : "-10%";
    const to: string = reverse 
        ? "-10%" 
        : "-110%";
    const direction: string = reverse 
        ? "to left" 
        : "to right";
    return (
        <PulseLine {...{
            name: name
        }}>
            <animated.div {...{
                style: {
                    ...useSpring({from: {left: from}, to: {left: to}, delay: delay, config: {tension: 5, friction: 4}, loop: true}),
                    ...{
                        width: "40px",
                        height: "2.5px",
                        bottom: "1.25px",
                        background: `linear-gradient(${direction}, transparent, rgba(163, 163, 163, 0.25))`,
                        borderRadius: "25px",
                        position: "relative"
                    },
                    ...style ?? {}
                }
            }}>
            </animated.div>
        </PulseLine>
    );
}