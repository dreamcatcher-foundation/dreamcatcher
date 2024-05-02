import React, {type ReactNode} from "react";
import Text from "../../component/text/Text.tsx";
import {defaultMappedEventEmitter} from "../../lib/messenger/DefaultMappedEventEmitter.ts";

export default function ConnectButton(): ReactNode {
    return (
        <Text
        name="connectButton"
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
        onClick={() => defaultMappedEventEmitter.postEvent("connectButton", "CLICK")}
        className="swing-in-top-fwd"/>
    );
}