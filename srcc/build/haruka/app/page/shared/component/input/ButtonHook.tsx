import React, {type ReactNode, type CSSProperties} from "react";
import TextHook from "../text/TextHook.tsx";
import RowHook, {type RowHookProps} from "../layout/RowHook.tsx";
import {EventsStream} from "../../../../lib/events-emitter/EventsStream.ts";

export interface ButtonHookProps extends RowHookProps {
    text?: string;
    color: string;
    textStyle?: CSSProperties;
}

export default function ButtonHook(_props: ButtonHookProps): ReactNode {
    const {nodeKey: uniqueId, text, textStyle, style, spring, color, ...more} = _props;
    return (
        <RowHook
        nodeKey={uniqueId}
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
            EventsStream.dispatch(uniqueId, "setSpring", {
                cursor: "pointer"
            });
        }}
        onMouseLeave={function() {
            EventsStream.dispatch(uniqueId, "setSpring", {
                cursor: "auto"
            });
        }}
        onClick={() => EventsStream.dispatchEvent(uniqueId, "CLICK")}
        {...more}>
            <TextHook
            nodeKey={`${uniqueId}.text`}
            text={text}
            style={{
                background: color,
                ...textStyle ?? {}
            }}>
            </TextHook>
        </RowHook>
    );
}