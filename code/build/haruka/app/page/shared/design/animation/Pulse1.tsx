import React, {type ReactNode} from "react";
import Pulse from "../../components/design/animation/Pulse.tsx";

export default function Pulse1(): ReactNode {
    return (
        <Pulse
        delay={8000}
        style={{
            position: "relative"
        }}/>
    );
}