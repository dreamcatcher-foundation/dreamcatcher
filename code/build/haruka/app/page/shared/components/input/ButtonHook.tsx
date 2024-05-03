import React, {type ReactNode, type CSSProperties} from "react";
import TextHook from "../text/TextHook.tsx";
import RowHook, {type RowHookProps} from "../layout/RowHook.tsx";
import {defaultMappedEventEmitter} from "../../../../library/messenger/DefaultMappedEventEmitter.ts";

export interface ButtonHookProps extends RowHookProps {
    text?: string;
    color: string;
    textStyle?: CSSProperties;
}

export default function ButtonHook(_props: ButtonHookProps): ReactNode {
    const {uniqueId, text, textStyle, style, spring, color, ...more} = _props;
    return (
        <RowHook
        uniqueId={uniqueId}
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
        onMouseEnter={function() {
            defaultMappedEventEmitter.post(uniqueId, "setSpring", {
                cursor: "pointer"
            });
        }}
        onMouseLeave={function() {
            defaultMappedEventEmitter.post(uniqueId, "setSpring", {
                cursor: "auto"
            });
        }}
        onClick={() => defaultMappedEventEmitter.postEvent(uniqueId, "CLICK")}
        {...more}>
            <TextHook
            uniqueId={`${uniqueId}.text`}
            text={text}
            style={{
                background: color,
                ...textStyle ?? {}
            }}>
            </TextHook>
        </RowHook>
    );
}