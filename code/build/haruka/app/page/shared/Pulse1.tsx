import React, {type ReactNode} from "react";
import Pulse from "../../component/effect/Pulse.tsx/Pulse.tsx";

export default function Pulse1(): ReactNode {
    return (
        <Pulse
        name="pulse1"
        delay={8000}
        style={{
        position: "relative",
        }}/>
    );
}