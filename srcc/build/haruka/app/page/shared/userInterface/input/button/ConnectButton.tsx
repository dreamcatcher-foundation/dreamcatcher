import React, {type ReactNode} from "react";
import TextHook from "../../../component/text/TextHook.tsx";
import {EventsStream} from "../../../../../lib/events-emitter/EventsStream.ts";

export default function ConnectButton(): ReactNode {
    return (
        <TextHook
        nodeKey="connectButton"
        text="Connect"
        style={{
            width: "auto",
            height: "50px",
            fontSize: "20px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        }}
        onMouseEnter={() => EventsStream.dispatch("connectButton", "setSpring", {cursor: "pointer"})}
        onMouseLeave={() => EventsStream.dispatch("connectButton", "setSpring", {cursor: "auto"})}
        onClick={() => EventsStream.dispatchEvent("connectButton", "CLICK")}/>
    );
}