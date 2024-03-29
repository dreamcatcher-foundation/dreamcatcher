import {type CSSProperties} from "react";

export function Row({width, height, stylesheet, children}: {width: string; height: string; stylesheet?: CSSProperties; children?: JSX.Element | (JSX.Element)[]}) {
    const rowStylesheet = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: width,
        height: height,
        ...stylesheet
    };
    return (<div style={rowStylesheet as any}>{children}</div>);
}