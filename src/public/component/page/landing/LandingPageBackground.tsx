import { Col } from "@component/Col";
import { Blurdot } from "@component/Blurdot";
import { RelativeUnit } from "@lib/RelativeUnit";
import * as ColorPalette from "@component/ColorPalette";
import React from "react";
 
export function LandingPageBackground(): React.JSX.Element {
    return <>
        <Col
        style={{
            width: "100%",
            height: "100%",
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
        </Col>
    </>;
}