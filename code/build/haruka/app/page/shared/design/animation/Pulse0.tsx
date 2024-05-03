import React, {type ReactNode} from "react";
import Pulse from "../../components/design/animation/Pulse.tsx";

export default function Pulse0(): ReactNode {
    return (
        <Pulse
        delay={4000}
        reverse
        style={{
            position: "absolute",
            bottom: "200px"
        }}/>
    );
}