import type {ReactNode} from "react";
import type {RenderedProps} from "../rendered/Rendered.tsx";
import {animated} from "react-spring";
import {useSpring} from "react-spring";
import PulseLine from "./PulseLine.tsx";

export type PulseProps = RenderedProps & {
    delay?: number;
    reverse?: boolean;
};

export default function Pulse(props: PulseProps): ReactNode {
    let {style, delay, reverse} = props;
    delay = delay ?? 0;
    reverse = reverse ?? false;
    const from: string = reverse ? "110%" : "-10%";
    const to: string = reverse ? "-10%" : "-110%";
    const direction: string = reverse ? "to left" : "to right";
    return <PulseLine>
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
                },
                ...style ?? {}
            }
        }}>
        </animated.div>
    </PulseLine>
}