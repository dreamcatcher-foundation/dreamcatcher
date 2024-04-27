import type {CSSProperties} from "react";
import React from "react";
import Col from "../structure/Col.tsx";

export default function Layer({
    style,
    ...more}: {
        style?: CSSProperties;
        [key: string]: any;}): React.JSX.Element {
    return <Col {...{
        "style": {
            "width": "100%",
            "height": "100%",
            "position": "absolute",
            "overflow": "hidden",
            ...style ?? {}
        },
        ...more
    }}/>;
}