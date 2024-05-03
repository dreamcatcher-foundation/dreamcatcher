import React, {type ReactNode} from "react";
import Page from "../shared/components/layout/Page.tsx";
import NavigationLayer from "../shared/layer/NavigationLayer.tsx";
import Pulse0 from "../shared/design/animation/Pulse0.tsx";
import Pulse1 from "../shared/design/animation/Pulse1.tsx";
import BlurDot0 from "../shared/design/BlurDot0.tsx";
import BlurDot1 from "../shared/design/BlurDot1.tsx";
import Layer from "../shared/components/layout/Layer.tsx";
import RowHook from "../shared/components/layout/RowHook.tsx";
import Window from "./window/Window.tsx";

export default function HomePage(): ReactNode {
    return (
        <Page>
            <Layer>
                <Pulse0/>
                <Pulse1/>
                <BlurDot0/>
                <BlurDot1/>
            </Layer>
            <Layer>
                <RowHook uniqueId="homePage.row">
                    <Window/>
                </RowHook>
            </Layer>
            <NavigationLayer/>
        </Page>
    );
}