import { type ReactNode } from "react";
import { type CSSProperties } from "react";
import { type IRowHookProps } from "@atlas/component/layout/RowHook.tsx";
import { RowHook } from "@atlas/component/layout/RowHook.tsx";
import { TextHook } from "@atlas/component/text/TextHook.tsx";
import { Stream } from "@atlas/shared/com/Stream.ts";
import React from "react";

interface IButtonHookProps extends IRowHookProps {
    text?: string;
    color: string;
    textStyle?: CSSProperties;
}

function ButtonHook(props: IButtonHookProps): ReactNode {
    let {node, text, textStyle, style, spring, color, ...more} = props;
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
        onMouseEnter={() => Stream.dispatch({toNode: node, command: "setSpring", timeout: 0n, item: {cursor: "pointer"}})}
        onMouseLeave={() => Stream.dispatch({toNode: node, command: "setSpring", timeout: 0n, item: {cursor: "auto"}})}
        onClick={() => Stream.dispatchEvent({fromNode: node, event: "click"})}
        {...more}>
            <TextHook
            node={`${node}.text`}
            text={text}
            style={{
                background: color,
                ...textStyle ?? {}
            }}>
            </TextHook>
        </RowHook>
    );
}

export { type IButtonHookProps };
export { ButtonHook };