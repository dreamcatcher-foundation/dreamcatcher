import React, {type ReactNode} from "react";
import BlurDot from "./BlurDot.tsx";

export default function BlurDot1(): ReactNode {
    return (
        <BlurDot {...{
            name: "blurDot1",
            color0: "#615FFF",
            color1: "#161616",
            style: {
                width: "1000px",
                height: "1000px",
                position: "absolute",
                right: "600px",
                bottom: "200px"
            }
        }}>
        </BlurDot>
    );
}