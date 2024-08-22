import type { ColProps } from "@component/Col";
import { Col } from "@component/Col";
import React from "react";

export interface BlurdotProps extends ColProps {
    color0: string;
    color1: string;
}

export function Blurdot(props: BlurdotProps): React.JSX.Element {
    let { color0, color1, style, ... more } = props;
    return <>
        <Col
        style={{
            background: `radial-gradient(closest-side, ${ color0 }, ${ color1 })`,
            opacity: "0.05",
            ... style ?? {}
        }}
        { ... more }/>
    </>;
}