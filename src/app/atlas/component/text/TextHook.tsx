import { type ReactNode } from "react";
import { type IHookProps } from "@atlas/component/Hook.tsx";
import { EventSubscription } from "fbemitter";
import { useState } from "react";
import { useEffect } from "react";
import { Stream } from "@atlas/shared/com/Stream.ts";
import { Hook } from "@atlas/component/Hook.tsx";
import React from "react";

interface ITextHookProps extends IHookProps {
    text?: string;
}

function TextHook(props: ITextHookProps): ReactNode {
    let {node, text: textProp, style, children, ...more} = props;
    let [text, setText] = useState<string>(textProp ?? "");
    useEffect(function() {
        let subscription: EventSubscription = Stream.createSubscription({atNode: node, command: "setText", hook: (text: string) => setText(text)});
        return () => subscription.remove();
    }, []);
    return (
        <Hook
        node={node}
        style={{
            fontSize: "1em",
            fontFamily: "roboto mono",
            fontWeight: "bold",
            color: "white",
            background: "#D6D5D4",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparrent",
            ...style ?? {}
        }}
        {...more}>
            {text}
        </Hook>
    );
}

export { type ITextHookProps };
export { TextHook };