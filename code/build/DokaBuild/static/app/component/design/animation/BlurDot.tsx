import {animated, useSpring} from "react-spring";
import React from "react";
export default function BlurDot({width, height, color0, color1}: {width: string; height: string; color0: string; color1: string;}) {
    const style = {
        width: width,
        height: height,
        background: `radial-gradient(closest-side, ${color0}, ${color1})`,
        opacity: "0.10"
    };
    return <animated.div style={style}/>
}