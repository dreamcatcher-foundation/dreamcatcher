import React, {type ReactNode} from "react";
import {EventsStream} from "../../../../lib/events-emitter/EventsStream.ts";

export interface TextFieldHookProps {
    uniqueId: string;
    placeholder?: string;
}

export default function TextFieldHook(_props: TextFieldHookProps): ReactNode {
    const {uniqueId, placeholder} = _props;
    return (
        <input
        style={{
            width: "100%",
            height: "auto",
            display: "flex",
            flexDirection: "row",
            justifySelf: "start",
            alignSelf: "start",
            fontSize: "1em",
            fontFamily: "roboto mono",
            fontWeight: "bold",
            color: "white",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "#D6D5D4",
            background: "transparent",
            padding: "0.5em"
        }}
        placeholder={placeholder}
        onChange={(event: any) => EventsStream.dispatchEvent(uniqueId, "INPUT_CHANGE", event.target.value)}>
        </input>
    );
}