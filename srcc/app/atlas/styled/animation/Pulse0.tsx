import { type ReactNode } from "react";
import { Pulse } from "@atlas/component/animation/Pulse.tsx";
import React from "react";

function Pulse0(): ReactNode {
    return (
        <Pulse
        delay={4000}
        reverse
        style={{
            position: "absolute",
            bottom: "200px"
        }}>
        </Pulse>
    );
}

export { Pulse0 };