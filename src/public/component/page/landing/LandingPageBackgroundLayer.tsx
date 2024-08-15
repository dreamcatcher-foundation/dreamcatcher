import { Layer } from "@component/Layer";
import { Blurdot } from "@component/Blurdot";
import { RelativeUnit } from "@lib/RelativeUnit";
import * as ColorPalette from "@component/ColorPalette";
import React from "react";
 
export function LandingPageBackgroundLayer(): React.JSX.Element {
    return <>
        <Layer
        style={{
            background: ColorPalette.OBSIDIAN.toString()
        }}>
            <Blurdot
            color0={ ColorPalette.DEEP_PURPLE.toString() }
            color1={ ColorPalette.OBSIDIAN.toString() }
            style={{
                width: RelativeUnit(500),
                aspectRatio: "1/1",
                position: "absolute",
                right: RelativeUnit(100)
            }}/>
            <Blurdot
            color0="#0652FE"
            color1={ ColorPalette.OBSIDIAN.toString() }
            style={{
                width: RelativeUnit(500),
                aspectRatio: "1/1",
                position: "absolute",
                left: RelativeUnit(100)
            }}/>
        </Layer>
    </>;
}