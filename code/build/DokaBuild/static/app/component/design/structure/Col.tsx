import React, {type CSSProperties} from "react";

export interface ColProps {
    width: string;
    height: string;
    style?: CSSProperties;
    children?: JSX.Element | (JSX.Element)[];
}

export default function Col(props: ColProps) {
    let {
        width,
        height,
        style,
        children
    } = props;
    style = style ?? {};
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