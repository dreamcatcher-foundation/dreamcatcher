import React, {type ReactNode} from "react";
import Layer from "../../component/layout/Layer.tsx";
import BlurDot0 from "./BlurDot0.tsx";
import BlurDot1 from "./BlurDot1.tsx";
import Pulse0 from "./Pulse0.tsx";
import Pulse1 from "./Pulse1.tsx";

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