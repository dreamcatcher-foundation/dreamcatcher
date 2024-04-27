import React from "react";
import BlurDot from "./BlurDot.tsx";

export default function BlurDot1(): React.JSX.Element {
    return (
        <BlurDot {...{
            "remoteId": "blurDot1",
            "color0": "#615FFF",
            "color1": "#161616",
            "remoteStyle": {
                "width": "1000px",
                "height": "1000px",
                "position": "absolute",
                "left": "600px",
                "top": "200px"
            }
        }}>
        </BlurDot>
    );
}