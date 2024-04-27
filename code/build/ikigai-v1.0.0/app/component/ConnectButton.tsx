import React, {useState, useEffect} from "react";
import {RenderedText} from "./Rendered_.tsx";
import {on, post, render} from "../operator/Emitter.ts";

type IConnectButtonProps = ({});

export function ConnectButton(props: IConnectButtonProps) {
    const {} = props;

    const args = ({
        nodeId: "ConnectButton",
        initialText: "Connect",
        initialStyle: ({
            width: "auto",
            height: "50px",
            fontSize: "20px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        }),
        onMouseEnter: () => render({
            recipient: "ConnectButton",
            spring: ({
                cursor: "auto"
            })
        }),
        onMouseLeave: () => render({
            recipient: "ConnectButton",
            spring: ({
                cursor: "auto"
            })
        }),
        onClick: () => post({
            sender: "ConnectButton",
            message: "Click"
        }),
        initialClassName: "swing-in-top-fwd" 
    }) as const;

    return <RenderedText {...args}></RenderedText>
}