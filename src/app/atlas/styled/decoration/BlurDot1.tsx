import { type ReactNode } from "react";
import { BlurDot } from "@atlas/component/decoration/BlurDot.tsx";
import React from "react";

function BlurDot1(): ReactNode {
    return (
        <BlurDot
        color0="#0652FE"
        color1="#161616"
        style={{
            width: "1000px",
            height: "1000px",
            position: "absolute",
            left: "600px",
            top: "200px"
        }}>
        </BlurDot>
    );
}

export { BlurDot1 };