import React from "react";
import RemoteText from "../Text.tsx";
import {defaultEventsHub} from "../../../event/hub/DefaultEventsHub.ts";

export default function ConnectButton(): React.JSX.Element {
    return <RemoteText {...{
        "address": "ConnectButton",
        "initialText": "Connect",
        "initialStyle": {
            "width": "auto",
            "height": "50px",
            "fontSize": "20px",
            "display": "flex",
            "flexDirection": "row",
            "justifyContent": "center",
            "alignItems": "center"
        },
        "onMouseEnter": () => defaultEventsHub.post("ConnectButton", "SpringRenderRequest", {"cursor": "pointer"}),
        "onMouseLeave": () => defaultEventsHub.post("ConnectButton", "SpringRenderRequest", {"cursor": "auto"}),
        "onClick": () => defaultEventsHub.post("ConnectButton", "Click"),
        "initialClassName": "swing-in-top-fwd"
    }}/>
}