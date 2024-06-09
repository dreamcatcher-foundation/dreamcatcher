import { type ReactNode } from "react";
import { type CSSProperties } from "react";
import { type IRowHookProps } from "@atlas/component/layout/RowHook.tsx";
import { RowHook } from "@atlas/component/layout/RowHook.tsx";
import { TextHook } from "@atlas/component/text/TextHook.tsx";
import { EventBus } from "@atlas/class/eventBus/EventBus.ts";
import React from "react";

export interface IButtonHookProps extends IRowHookProps {
    text?: string;
    color: string;
    textColor?: string;
    textStyle?: CSSProperties;
}

export function ButtonHook(props: IButtonHookProps): ReactNode {
    let {node, text, textStyle, style, spring, color, textColor, ...more} = props;
    return (
        <RowHook
        node={node}
        style={{
        width: "150px",
        height: "40px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: color,
        ...style ?? {}
        }}
        onMouseEnter={() => new EventBus.Message({
            to: node, 
            message: "setSpring", 
            timeout: 0n, 
            item: {
                cursor: "pointer"
            }
        })}
        onMouseLeave={() => new EventBus.Message({
            to: node,
            message: "setSpring",
            timeout: 0n,
            item: {
                cursor: "auto"
            }
        })}
        onClick={() => new EventBus.Event({
            from: node,
            event: "click"
        })}
        {...more}>
            <TextHook
            node={`${node}.text`}
            text={text}
            color={textColor}
            style={{
                ...textStyle ?? {}
            }}>
            </TextHook>
        </RowHook>
    );
}