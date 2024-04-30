import type {RenderedProps} from "./Rendered.tsx";
import type {ReactNode} from "react";
import type {EventSubscription} from "../../../event/EventsStream.ts";
import {useState} from "react";
import {useEffect} from "react";
import EventsHub from "../../../event/EventsHub.ts";
import Rendered from "./Rendered.tsx";
import UniqueTag from "../../../event/UniqueTag.ts";
import React from "react";

export type RenderedTextProps = RenderedProps & {text?: string;};

export default function RenderedText(props: RenderedTextProps): ReactNode {
    let {tag, text: textProp, style, children, ...more} = props;
    const [text, setText] = useState<string>(textProp ?? "");
    tag = tag ?? new UniqueTag();
    useEffect(function() {
        const subscription: EventSubscription = EventsHub.hook(tag, "setText", (text: string) => setText(text));
        return function() {
            subscription.remove();
            return;
        }
    }, []);
    return <Rendered {...{
        tag: tag,
        style: {
            fontSize: "1em",
            fontFamily: "roboto mono",
            fontWeight: "bold",
            color: "white",
            background: "#D6D5D4",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            ...style ?? {}
        },
        children: [text],
        ...more
    }}/>;
}