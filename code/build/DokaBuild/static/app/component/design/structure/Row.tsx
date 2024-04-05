import React, {type CSSProperties} from "react";

export interface RowProps {
    width: string;
    height: string;
    style?: CSSProperties;
    children?: JSX.Element | (JSX.Element)[];
}

export default function Row(props: RowProps) {
    let {
        width,
        height,
        style,
        children
    } = props;
    style = style ?? {};
    style = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: width,
        height: height,
        ...style
    };
    return <div style={style} children={children}/>;
}