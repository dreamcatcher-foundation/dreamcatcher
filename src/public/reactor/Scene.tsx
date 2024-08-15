import { U } from "./Utils";
import { Ref } from "@lib/Ref";
import { animated } from "react-spring";
import { useSpring } from "react-spring";
import React from "react";

/// to move the camera, we set the main page's position
/// and everything is relative to it.

export function Scene() {
    let [position, setPosition] = useSpring(() => ({ x: 0, y: 0 }));
    setTimeout(() => {
        setPosition.start({
            x: 5,
            y: 0
        })
    }, 1000);
    return <>
        <animated.div
        style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            height: "100vh",
            background: "#111111",
            overflow: "hidden"
        }}>
            <animated.div
            style={{
                position: "relative",
                background: "green",
                width: U(100),
                aspectRatio: "1/1",
                x: position.x,
                y: position.y
            }}>

            </animated.div>
        </animated.div>
    </>;
}