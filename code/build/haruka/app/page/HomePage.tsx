import React, {type ReactNode} from "react";
import Page from "../component/layout/Page.tsx";
import Layer from "../component/layout/Layer.tsx";
import Pulse0 from "../component/effect/Pulse0.tsx";
import Pulse1 from "../component/effect/Pulse1.tsx";
import BlurDot0 from "../component/effect/BlurDot0.tsx";
import BlurDot1 from "../component/effect/BlurDot1.tsx";

export default function HomePage(): ReactNode {
    return (
        <Page name={"homePage"}>
            <Layer name={"homePageBackground"}>
                <Pulse0></Pulse0>
                <Pulse1></Pulse1>
                <BlurDot0></BlurDot0>
                <BlurDot1></BlurDot1>
            </Layer>
        </Page>
    );
}