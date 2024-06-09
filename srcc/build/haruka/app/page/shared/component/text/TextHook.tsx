import type { ReactNode } from "@HarukaToolkitBundle";
import type { EventSubscription } from "@HarukaToolkitBundle";
import type { IHookProps } from "../Hook.tsx";
import { useState } from "@HarukaToolkitBundle";
import { useEffect } from "@HarukaToolkitBundle";
import { stream } from "@HarukaToolkitBundle";
import { Hook } from "../Hook.tsx";
import React from "react";

interface ITextHookProps extends IHookProps {
    text?: string;
}

function TextHook(_props: ITextHookProps): ReactNode {
    let {nodeName, text: textProp, style, children, ...more} = _props;
    let [text, setText] = useState<string>(textProp ?? "");
    useEffect(function() {
        let subscription: EventSubscription = stream().createCommand({atNodeName: nodeName, commandName: "setText", hook: (text: string) => setText(text)});
        return function() {
            return subscription.remove();
        }
    }, []);
    return (
        <Hook
        nodeName={nodeName}
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

export type { ITextHookProps };
export { TextHook };