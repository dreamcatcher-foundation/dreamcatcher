import {type CSSProperties} from "react";

export function Col({width, height, stylesheet, children}: {width: string; height: string; stylesheet?: CSSProperties; children?: JSX.Element | (JSX.Element)[]}) {
    const colStylesheet = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: width,
        height: height,
        ...stylesheet
    };
    return (<div style={colStylesheet as any}>{children}</div>);
}