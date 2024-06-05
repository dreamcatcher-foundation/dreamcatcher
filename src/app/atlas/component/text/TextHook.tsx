import { type IHookProps } from "@atlas/component/Hook.tsx";
import { EventBus } from "../../class/eventBus/EventBus.ts";
import { Hook } from "@atlas/component/Hook.tsx";
import { Text } from "./Text.tsx";
import React from "react";

export interface ITextHookProps extends IHookProps {
    text?: string;
    color?: string;
    textStyle?: React.CSSProperties;
}

export function TextHook(props: ITextHookProps): React.ReactNode {
    let {
        node, 
        text, 
        textStyle: textStyleProp, 
        color, 
        children, 
        ...more
    } = props;
    let textStyle: React.CSSProperties = {
        fontSize: "1em",
        fontFamily: "roboto mono",
        fontWeight: "bold",
        color: "white",
        background: color ?? "#D6D5D4",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        ...textStyleProp ?? {}
    };
    React.useEffect(function() {
        new EventBus.Message({
            to: node,
            message: "push",
            item: <Text text={text ?? ""} style={textStyle}/>
        });
        const subscription: EventBus.ISubscription 
            = new EventBus.MessageSubscription({
                at: node,
                message: "setText",
                handler(item?: unknown): void {
                    if (!item) {
                        return;
                    }
                    if (typeof item !== "string") {
                        return;
                    }
                    new EventBus.Message({
                        to: node,
                        message: "swap",
                        item: <Text text={item} style={textStyle}/>
                    });
                }
            })
        return () => subscription.remove();
    }, []);
    return <Hook node={node} {...more}/>;
}