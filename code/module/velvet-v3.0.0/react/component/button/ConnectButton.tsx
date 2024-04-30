import type {ReactNode} from "react";
import RenderedText from "../rendered/RenderedText.tsx";
import UniqueTag from "../../../event/UniqueTag.ts";
import EventsHub from "../../../event/EventsHub.ts";

export const connectButtonTag: UniqueTag = new UniqueTag();

export default function ConnectButton(): ReactNode {
    return <RenderedText {...{
        tag: connectButtonTag,
        text: "Connect",
        style: {
            width: "auto",
            height: "50px",
            fontSize: "20px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        },
        onMouseEnter: () => EventsHub.post(connectButtonTag, "setSpring", {cursor: "pointer"}),
        onMouseLeave: () => EventsHub.post(connectButtonTag, "setSpring", {cursor: "auto"}),
        onClick: () => EventsHub.post(connectButtonTag, "Click"),
        className: "swing-in-top-fwd"
    }}>
    </RenderedText>;
}