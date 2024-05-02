import React, {type ReactNode} from "react";
import Layer from "../layout/Layer.tsx";
import BlurDot0 from "./effect/BlurDot0.tsx";
import BlurDot1 from "./effect/BlurDot1.tsx";
import Pulse0 from "../../page/shared/Pulse0.tsx";
import Pulse1 from "../../page/shared/Pulse1.tsx";

export default function BackgroundLayer(): ReactNode {
    return (
        <Layer
        name="backgroundLayer">
            <Pulse0/>
            <Pulse1/>
            <BlurDot0/>
            <BlurDot1/>
        </Layer>
    );
}