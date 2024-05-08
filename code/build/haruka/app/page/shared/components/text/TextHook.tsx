import React, {type ReactNode, useState, useEffect} from "react";
import {type EventSubscription} from "fbemitter";
import {defaultMappedEventEmitter} from "../../../../library/event-driven-architecture/DefaultMappedEventEmitter.ts";
import Hook, {type HookProps} from "../Hook.tsx";

export interface TextHookProps extends HookProps {
    text?: string;
}

export default function TextHook(_props: TextHookProps): ReactNode {
    const {uniqueId, text: textProp, style, children, ...more} = _props;
    const [text, setText] = useState<string>(textProp ?? "");
    useEffect(function() {
        const subscription: EventSubscription = defaultMappedEventEmitter.hook(uniqueId, "setText", (text: string) => setText(text));
        return function() {
            return subscription.remove();
        }
    }, []);
    return (
        <Hook
        uniqueId={uniqueId}
        style={{
            fontSize: "1em",
            fontFamily: "roboto mono",
            fontWeight: "bold",
            color: "white",
            background: "#D6D5D4",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            ...style ?? {}
        }}
        {...more}>
            {text}
        </Hook>
    );
}