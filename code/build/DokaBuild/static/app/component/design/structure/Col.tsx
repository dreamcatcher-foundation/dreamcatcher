import React, {type CSSProperties} from "react";
export default function Col({width, height, style = {}, children}: {width: string; height: string; style?: CSSProperties; children?: JSX.Element | (JSX.Element)[];}) {
    style = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: width,
        height: height,
        ...style
    };
    return <div style={style} children={children}/>;
}