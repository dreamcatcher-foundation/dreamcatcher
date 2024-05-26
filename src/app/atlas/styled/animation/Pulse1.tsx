import { type ReactNode } from "react";
import { Pulse } from "@atlas/component/animation/Pulse.tsx";
import React from "react";

function Pulse1(): ReactNode {
    return (
        <Pulse
        delay={8000}
        style={{
            position: "relative"
        }}>
        </Pulse>
    );
}

export { Pulse1 };