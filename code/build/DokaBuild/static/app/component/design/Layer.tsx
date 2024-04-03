import React from "react";
import Col from "./Col.tsx";

export interface ILayerProps {
    zIndex: string;
    children?: JSX.Element | (JSX.Element)[];
}

export default function Layer(props: ILayerProps) {
    const zIndex = props.zIndex;
    const children = props.children;
    return (
        <Col width={"100%"} height={"100vh"} style={{position: "absolute", zIndex: zIndex}} children={children}/>
    );
}