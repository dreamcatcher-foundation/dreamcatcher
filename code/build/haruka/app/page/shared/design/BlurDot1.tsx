import React, {type ReactNode} from "react";
import BlurDot from "../components/design/BlurDot.tsx";

export default function BlurDot1(): ReactNode {
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
        }}/>
    );
}