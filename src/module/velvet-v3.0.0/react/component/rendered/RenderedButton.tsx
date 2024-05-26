import type {RenderedProps} from "./Rendered.tsx";
import type {ReactNode} from "react";
import Rendered from "./Rendered.tsx";
import RenderedText from "./RenderedText.tsx";
import EventsHub from "../../../event/EventsHub.ts";
import React from "react";
import UniqueTag from "../../../event/UniqueTag.ts";

export type RenderedButtonProps = RenderedProps & {
    textTag?: UniqueTag;
    text?: string;
};

export default function RenderedButton(props: RenderedButtonProps): ReactNode {
    let {tag, textTag, text, spring, style, ...more} = props;
    tag = tag ?? new UniqueTag();
    textTag = textTag ?? new UniqueTag();
    return <Rendered {...{
        spring: {
            background: "#615FFF",
            boxShadow: "0px 0px 32px 2px #615FFF",
            ...spring ?? {}
        },
        style: {
            width: "200px",
            height: "50px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            ...style ?? {}
        },
        onMouseEnter: () => EventsHub.post(tag, "setSpring", {
            background: "#6C69FF",
            boxShadow: "0px 0px 32px 4px #6C69FF",
            cursor: "pointer"
        }),
        onMouseLeave: () => EventsHub.post(tag, "setSpring", {
            background: "#615FFF",
            boxShadow: "0px 0px 32px 2px #615FFF",
            cursor: "auto"
        }),
        onClick: () => EventsHub.post(tag, "Click"),
        ...more
    }}>
        <RenderedText {...{
            tag: textTag,
            text: text,
            style: {
                fontSize: "15px",
                background: "#171717"
            }
        }}>
        </RenderedText>
    </Rendered>;
}