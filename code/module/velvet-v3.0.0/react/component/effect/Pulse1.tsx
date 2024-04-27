import React from "react";
import Pulse from "./Pulse.tsx";

export default function Pulse1(): React.JSX.Element {
    return <Pulse {...{
        "delay": 8000n,
        "style": {
            "position": "relative"
        },
        "reverse": true
    }}/>;
}