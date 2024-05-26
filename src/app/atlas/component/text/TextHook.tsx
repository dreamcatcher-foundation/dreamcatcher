import { type ReactNode } from "react";
import { type CSSProperties } from "react";
import { type IHookProps } from "@atlas/component/Hook.tsx";
import { EventSubscription } from "fbemitter";
import { useEffect } from "react";
import { Stream } from "@atlas/shared/com/Stream.ts";
import { Hook } from "@atlas/component/Hook.tsx";
import { Text } from "@atlas/component/text/Text.tsx";
import React from "react";

interface ITextHookProps extends IHookProps {
    text?: string;
    color?: string;
    textStyle?: CSSProperties;
}

function TextHook(props: ITextHookProps): ReactNode {
    let {node, text, textStyle: textStyleProp, color, children, ...more} = props;
    let textStyle: CSSProperties = {
        fontSize: "1em",
        fontFamily: "roboto mono",
        fontWeight: "bold",
        color: "white",
        background: color ?? "#D6D5D4",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        ...textStyleProp ?? {}
    };
    useEffect(function() {
        Stream.dispatch({
            toNode: node,
            command: "push",
            item: <Text text={text ?? ""} style={textStyle}/>
        });

        let subscription: EventSubscription = Stream.createSubscription({
            atNode: node, 
            command: "setText", 
            hook(text: string) {
                Stream.dispatch({
                    toNode: node,
                    command: "swap",
                    item: <Text text={text} style={textStyle}/>
                });
            }
        });
        return () => subscription.remove();
    }, []);
    return (
        <Hook
        node={node}
        {...more}/>
    );
}

export { type ITextHookProps };
export { TextHook };