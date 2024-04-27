import React from "react";
import type {CSSProperties} from "react";
import {animated} from "react-spring";
import {useSpring} from "react-spring";
import PulseLine from "./PulseLine.tsx";

export default function Pulse({
    remoteId,
    remoteStyle,
    delay,
    reverse,
}: {
    remoteId: string;
    remoteStyle?: CSSProperties;
    delay?: bigint;
    reverse?: boolean;
}): React.JSX.Element {
    const from: string = reverse ? "110%" : "-10%";
    const to: string = reverse ? "-10%" : "-110%";
    const dir: string = reverse ? "to left" : "to right";
    return (
        <PulseLine {...{
            "remoteId": remoteId,
            "remoteStyle": remoteStyle
        }}>
            <animated.div {...{
                "style": {
                    ...useSpring({
                        "from": {
                            "left": from
                        },
                        "to": {
                            "left": to
                        },
                        "delay": Number(delay ?? 0n),
                        "config": {
                            "tension": 5,
                            "friction": 4
                        },
                        "loop": true
                    }),
                    ...{
                        "width": "40px",
                        "height": "2.5px",
                        "bottom": "1.25px",
                        "background": `linear-gradient(${dir}, transparent, rgba(163, 163, 163, 0.25))`,
                        "borderRadius": "25px",
                        "position": "relative"
                    }
                },
            }}>
            </animated.div>
        </PulseLine>
    );
}

export default function Pulse({
    delay,
    reverse,
    style,
    ...more}: {
        delay?: bigint;
        reverse?: boolean;
        style?: CSSProperties;
}): React.JSX.Element {
    const from: string = reverse ? "110%" : "-10%";
    const to: string = reverse ? "-10%" : "-110%";
    const dir: string = reverse ? "to left" : "to right";
    return <PulseLine {...{
        "style": style ?? {},
        "children": [
            <animated.div {...{
                "style": {
                    ...useSpring({
                        "from": {
                            "left": from
                        },
                        "to": {
                            "left": to
                        },
                        "delay": Number(delay ?? 0n),
                        "config": {
                            "tension": 5,
                            "friction": 4
                        },
                        "loop": true
                    }),
                    ...{
                        "width": "40px",
                        "height": "2.5px",
                        "bottom": "1.25px",
                        "background": `linear-gradient(${dir}, transparent, rgba(163, 163, 163, 0.25))`,
                        "borderRadius": "25px",
                        "position": "relative"
                    }
                },
                ...more
            }}/>
        ]
    }}/>;
}