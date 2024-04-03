import React, {type CSSProperties} from "react";

export interface IColProps {
    width: string;
    height: string;
    style?: CSSProperties;
    children?: JSX.Element | (JSX.Element)[]; 
}

export default function Col(props: IColProps) {
    const width = props.width;
    const height = props.height;
    const initStyle = props.style ?? {};
    const children = props.children;
    const style = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: width,
        height: height,
        ...initStyle
    };
    return (
        <div style={style as any} children={children}/>
    );
}