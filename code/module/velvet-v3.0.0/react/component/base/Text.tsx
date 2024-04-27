import type {CSSProperties} from "react";
import React from "react";

export default function Text({
    text,
    style,
    ...more}: {
        text: string;
        style?: CSSProperties;
        [key: string]: any;}): React.JSX.Element {
    return <div {...{
        "style": {
            "fontSize": "1em",
            "fontFamily": "roboto mono",
            "fontWeight": "bold",
            "color": "white",
            "background": "D6D5D4",
            "WebkitBackgroundClip": "text",
            "WebkitTextFillColor": "transparent",
            ...style ?? {}
        },
        "children": text,
        ...more
    }}/>
}