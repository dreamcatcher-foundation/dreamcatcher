import Remote, {type IRemoteProps, broadcast, on, off} from "./Remote.tsx";
import RemoteCol from "./RemoteCol.tsx";
import React, {type CSSProperties, useEffect} from "react";

export interface IWindowProps extends IRemoteProps {
    width: string;
    height: string;
}

export default function Window(props: IWindowProps) {
    const name = props.name;
    const width = props.width;
    const height = props.height;
    const children = props.children;
    const initSpring = props.initSpring ?? {};
    const initStyle = props.initStyle ?? {};
    const spring: CSSProperties = {
        background: "#171717",
        padding: "40px",
        overflowX: "hidden",
        overflowY: "auto",
        width: width,
        height: height,
        ...initSpring
    };
    const style = {
        borderWidth: "1px",
        borderStyle: "solid",
        borderImage: "linear-gradient(to bottom, transparent, #474647) 1",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        ...initStyle
    };
    return (
        <RemoteCol name={name} width={width} height={height} initSpring={spring as any} initStyle={style as any}/>
    );
}