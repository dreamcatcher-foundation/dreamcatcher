import { Page } from "@component/Page";
import { Layer } from "@component/Layer";
import { Nav } from "@component/Nav";
import * as ColorPalette from "@component/ColorPalette";
import React from "react";

export function LandingPage(): React.JSX.Element {
    return <>
        <Page
        hlen={1n}
        vlen={1n}>
            <Layer
            style={{
                background: ColorPalette.OBSIDIAN.toString()
            }}>

            </Layer>
            <Layer>
                <Nav/>
            </Layer>
        </Page>
    </>;
}