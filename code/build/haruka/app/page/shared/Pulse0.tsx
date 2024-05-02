import React, {type ReactNode} from "react";
import Pulse from "../../component/effect/Pulse.tsx/Pulse.tsx";

export default function Pulse0(): ReactNode {
    return (
        <Pulse
        name="pulse0"
        delay={4000}
        reverse={true}
        style={{
        position: "absolute",
        bottom: "200px"
        }}/>
    );
}