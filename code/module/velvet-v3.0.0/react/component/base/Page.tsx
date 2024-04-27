import type {CSSProperties} from "react";
import React from "react";
import Col from "../structure/Col.tsx";

export default function Page({
    style,
    ...more}: {
        style?: CSSProperties;
        [key: string]: any;}): React.JSX.Element {
    return <Col {...{
        "style": {
            "width": "100vw",
            "height": "100vh",
            "overflow": "hidden",
            "background": "#161616",
            ...style ?? {}
        },
        ...more
    }}/>;
}