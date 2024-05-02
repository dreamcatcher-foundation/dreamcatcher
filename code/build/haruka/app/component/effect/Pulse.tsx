import React, {type ReactNode} from "react";
import PulseLine from "./PulseLine.tsx";
import {type BaseProps} from "../HookableAnimatedDiv.tsx";
import {animated, useSpring} from "react-spring";

export type PulseProps = BaseProps & {
    delay?: number;
    reverse?: boolean;
};

export default function Pulse(props: PulseProps): ReactNode {
    let {name, delay, reverse, style, ...more} = props;
    delay = delay ?? 0;
    reverse = reverse ?? false;
    const from: string = reverse ? "-10" : "110%";
    const to: string = reverse ? "110%" : "-10%";
    const direction: string = reverse ? "to right" : "to left";
    return (
        <PulseLine {...{
            name: name,
            style: style ?? {},
            mountDelay: 10000n
        }}>
            <animated.div {...{
                style: {
                    ...useSpring({
                        from: {
                            left: from
                        }, 
                        to: {
                            left: to
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
                        background: `linear-gradient(${direction}, transparent, rgba(163, 163, 163, 0.25))`,
                        borderRadius: "25px",
                        position: "relative"
                    }
                }
            }}>
            </animated.div>
        </PulseLine>
    );
}