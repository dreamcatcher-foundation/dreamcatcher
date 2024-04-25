import React, {type CSSProperties} from "react";
import {post} from "../operator/Emitter.ts";

export type RetroMinimaInput = ({
    nodeId: string;
    placeholder?: string;
    style?: CSSProperties;
    [k: string]: any;
});

export default function RetroMinimaInput(props: RetroMinimaInput) {
    const {
        nodeId,
        placeholder,
        style,
        ...more
    } = props;

    const input = ({
        style: ({
            width: "auto",
            height: "auto",
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
            color: "white",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "D6D5D4",
            background: "transparent",
            fontSize: "15px",
            fontWeight: "bold",
            fontFamily: "roboto mono",
            padding: "12px",
            textShadow: "4px 4px 64px 8px #FFFFFF",
            ...style ?? ({})
        }) as const,
        placeholder: placeholder ?? "",
        onChange: (event: any) => post({
            sender: nodeId,
            message: "Input",
            data: event
                .target
                .value
        }),
        ...more
    });

    return (<input {...input}></input>)
}