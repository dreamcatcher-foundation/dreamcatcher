import { Page } from "@component/Page";
import { Layer } from "@component/Layer";
import { Nav } from "@component/Nav";
import { LandingPageBackgroundLayer } from "./LandingPageBackgroundLayer";
import { LandingPageHeroSection } from "./LandingPageHeroSection";
import React from "react";

export function LandingPage(): React.JSX.Element {
    return <>
        <Page
        hlen={1n}
        vlen={1n}>
            <LandingPageBackgroundLayer/>
            <Layer
            style={{
                justifyContent: "start"
            }}>
                <Nav/>
                <LandingPageHeroSection/>
            </Layer>
        </Page>
    </>;
}