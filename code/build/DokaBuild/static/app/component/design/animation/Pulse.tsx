import Remote from "../remote/Remote.tsx";
import React, {type CSSProperties} from "react";
import {animated, useSpring, config} from "react-spring";
export default function Pulse({reverse = false}: {reverse?: boolean}) {
    function Line({children}: {children?: JSX.Element | (JSX.Element)[]}) {
        const style = {
            width: "100%",
            height: "0.50px",
            background: "linear-gradient(to right, transparent, rgba(163, 163, 163, 0.25), transparent)"
        };
        return <div style={style} children={children}/>
    }
    const from = reverse ? "110%" : "-10%";
    const to = reverse ? "-10%" : "110%";
    const dir = reverse ? "to left" : "to right";
    return (
        <Line>
            <animated.div style={{
                ...useSpring({
                    from: {
                        left: from
                    },
                    to: {
                        left: to
                    },
                    delay: 4000,
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
                    background: `linear-gradient(${dir}, transparent, rgba(163, 163, 163, 0.25))`,
                    borderRadius: "25px",
                    position: "relative",
                }
            }}/>
        </Line>
    );
}