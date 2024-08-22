import type { ColProps } from "@component/Col";
import { Col } from "@component/Col";
import React from "react";

export interface LayerProps extends ColProps {}

export function Layer(props: LayerProps): React.JSX.Element {
    let { style, ... more } = props;
    return <>
        <Col
        style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            overflow: "hidden",
            pointerEvents: "none",
            justifyContent: "space-between",
            ... style ?? {}
        }}
        { ... more }/>
    </>;
}