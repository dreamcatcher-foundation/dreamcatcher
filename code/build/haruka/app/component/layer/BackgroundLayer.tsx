import React, {type ReactNode} from "react";
import Layer from "../layout/Layer.tsx";
import Pulse0 from "../effect/Pulse0.tsx";
import Pulse1 from "../effect/Pulse1.tsx";
import BlurDot0 from "../effect/BlurDot0.tsx";
import BlurDot1 from "../effect/BlurDot1.tsx";

export default function BackgroundLayer(): ReactNode {
    return (
        <Layer name={"background"}>
            <Pulse0></Pulse0>
            <Pulse1></Pulse1>
            <BlurDot0></BlurDot0>
            <BlurDot1></BlurDot1>
        </Layer>
    );
}