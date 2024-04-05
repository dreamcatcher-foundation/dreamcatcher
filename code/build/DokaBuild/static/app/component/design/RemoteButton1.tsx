import Remote, {type IRemoteProps, broadcast, on} from "./Remote.tsx";
import SteelText from "./SteelText.tsx";
import React from "react";

export interface IRemoteButton1Props extends IRemoteProps {
    text: string;
    width?: string;
    height?: string;
    color?: string;
    initialClassName?: string;
}

export default function RemoteButton1(props: IRemoteButton1Props) {
    const name = props.name;
    const text = props.text;
    const width = props.width ?? "200px";
    const height = props.height ?? "50px";
    const color = props.color ?? "#171717";
    const initialClassName = props.initialClassName ?? "";
    const buttonInitialSpring = {
        width: width,
        height: height,
        background: "#615FFF",
        boxShadow: "0px 0px 32px 2px #615FFF"
    };
    const buttonInitialStyle = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    };
    const textStyle = {
        background: color,
        fontSize: "15px"
    };

    function onMouseEnter() {
        const spring = {
            background: "#6C69FF",
            boxShadow: "0px 0px 32px 8px #6C69FF",
            cursor: "pointer"
        };
        broadcast(`${name} render spring`, spring);
    }

    function onMouseLeave() {
        const spring = {
            background: "#615FFF",
            boxShadow: "0px 0px 32px 2px #615FFF",
            cursor: "auto"
        };
        broadcast(`${name} render spring`, spring);
    }

    function onClick() {
        broadcast(`${name} clicked`);
    }

    return (
        <Remote name={name} initSpring={buttonInitialSpring as any} initStyle={buttonInitialStyle as any} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick} initialClassName={initialClassName}>
            <SteelText text={text} style={textStyle}/>
        </Remote>
    );
}