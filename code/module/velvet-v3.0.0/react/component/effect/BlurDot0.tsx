import React from "react";
import BlurDot from "./BlurDot.tsx";

export default function BlurDot0(): React.JSX.Element {
    return (
        <BlurDot {...{
            "remoteId": "blurDot0",
            "color0": "#615FFF",
            "color1": "#161616",
            "remoteStyle": {
                "width": "1000px",
                "height": "1000px",
                "position": "absolute",
                "right": "600px",
                "bottom": "200px"
            }
        }}>
        </BlurDot>
    );
}