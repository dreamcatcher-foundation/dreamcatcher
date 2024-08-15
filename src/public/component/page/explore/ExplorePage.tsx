import type { ReactNode } from "react";
import { Page } from "@component/Page";
import { Layer } from "@component/Layer";
import { Nav } from "@component/Nav";
import { ExplorePageCard } from "@component/explore/ExplorePageCard";
import * as ColorPalette from "@component/ColorPalette";

export function ExplorePage(): ReactNode {
    function _Page({ children }: { children?: ReactNode }): ReactNode {
        return <>
            <Page
            hlen={1n}
            vlen={1n}>
                { children }
            </Page>
        </>;
    }
    function _Background(): ReactNode {
        function _Layer({ children }:{ children?: ReactNode }): ReactNode {
            return <>
                <Layer
                style={{
                    background: ColorPalette.OBSIDIAN.toString()
                }}>
                    { children }
                </Layer>
            </>;
        }
        return <>
            <_Layer/>
        </>;
    }
    return <>
        <_Page>
            <_Background/>
            <Layer>
                <Nav/>
                <ExplorePageCard/>
            </Layer>
        </_Page>
    </>;
}