import { Link } from "react-router-dom";
import { Row } from "@component/Row";
import { RelativeUnit } from "@lib/RelativeUnit";
import { Text } from "@component/Text";
import * as ColorPalette from "@component/ColorPalette";
import React from "react";

export function LandingPageLearnMoreButton(): React.JSX.Element {
    return <>
        <Link
        to="https://dreamcatcher-1.gitbook.io/dreamcatcher"
        style={{
            textDecoration: "none",
            width: RelativeUnit(15),
            aspectRatio: "4/1",
            borderColor: ColorPalette.GHOST_IRON.toString(),
            borderWidth: "1px",
            borderStyle: "solid",
            borderRadius: "5px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "auto",
            cursor: "pointer"
        }}>
            <Text
            text="Learn More"
            style={{
                fontSize: RelativeUnit(1.25)
            }}/>
        </Link>
    </>;
}