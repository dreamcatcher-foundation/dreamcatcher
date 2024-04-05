import {stream} from "../../../core/Stream.tsx";
import Remote, {type RemoteProps} from "./2.tsx";
import React from "react";

export interface RemoteButton1Props extends RemoteProps {
    text: string;
    width: string;
    height: string;
    color?: string;
}

export default function RemoteButton1(props: RemoteButton1Props) {
    let {
        name,
        spring,
        style,
        children,
        className,
        width,
        height,
        text
    } = props;
    c
}