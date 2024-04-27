import React from "react";
import Pulse from "./Pulse.tsx";

export default function Pulse0(): React.JSX.Element {
    return <Pulse {...{
        "delay": 4000n,
        "style": {
            "position": "relative",
            "bottom": "200px"
        },
        "reverse": false
    }}/>;
}