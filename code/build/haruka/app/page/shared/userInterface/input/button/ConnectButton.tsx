import React, {type ReactNode} from "react";
import TextHook from "../../../components/text/TextHook.tsx";
import {defaultMappedEventEmitter} from "../../../../../library/messenger/DefaultMappedEventEmitter.ts";

export default function ConnectButton(): ReactNode {
    return (
        <TextHook
        uniqueId="connectButton"
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
        onMouseEnter={() => defaultMappedEventEmitter.post("connectButton", "setSpring", {cursor: "pointer"})}
        onMouseLeave={() => defaultMappedEventEmitter.post("connectButton", "setSpring", {cursor: "auto"})}
        onClick={() => defaultMappedEventEmitter.postEvent("connectButton", "CLICK")}/>
    );
}