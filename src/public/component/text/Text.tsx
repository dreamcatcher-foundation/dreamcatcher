import type { RowProps } from "@component/Row";
import { Row } from "@component/Row";
import { RelativeUnit } from "@lib/RelativeUnit";
import {TextConfiguration} from "./TextConfiguration";
import * as ColorPalette from "@component/ColorPalette";
import React from "react";

export interface TextProps extends RowProps {
    text: string;
}

export function Text(props: TextProps): React.JSX.Element {
    let { text, style, ... more } = props;
    return <>
        <Row
        style={{
            fontSize: TextConfiguration.fontSize,
            fontWeight: TextConfiguration.fontWeight,
            fontFamily: TextConfiguration.fontFamily,
            color: TextConfiguration.color,
            ... style ?? {}
        }}
        { ... more }>
            { text }
        </Row>
    </>;
}