import { type ReactNode } from "react";
import { Page } from "@atlas/component/layout/Page.tsx";
import { NavLayer } from "@atlas/styled/layer/NavLayer.tsx";
import { Pulse0 } from "@atlas/styled/animation/Pulse0.tsx";
import { Pulse1 } from "@atlas/styled/animation/Pulse1.tsx";
import { BlurDot0 } from "@atlas/styled/decoration/BlurDot0.tsx";
import { BlurDot1 } from "@atlas/styled/decoration/BlurDot1.tsx";
import { Layer } from "@atlas/component/layout/Layer.tsx";
import { RowHook } from "@atlas/component/layout/RowHook.tsx";
import { Window } from "@atlas/styled/local/home-page/window/Window.tsx";

function HomePage(): ReactNode {
    return (
        <Page>
            <Layer>
                <Pulse0/>
                <Pulse1/>
                <BlurDot0/>
                <BlurDot1/>
            </Layer>
            <Layer>
                <RowHook
                node={"homePage.row"}>
                    <Window/>
                </RowHook>
            </Layer>
            <NavLayer/>
        </Page>
    );
}

export { HomePage };