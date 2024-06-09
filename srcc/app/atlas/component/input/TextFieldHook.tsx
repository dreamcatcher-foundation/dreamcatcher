import { type ReactNode } from "react";
import { type ComponentPropsWithoutRef } from "react";
import { EventBus } from "@atlas/class/eventBus/EventBus.ts";
import React from "react";

interface ITextFieldHookProps extends ComponentPropsWithoutRef<"input"> {
    node: string;
    placeholder?: string;
}

function TextFieldHook(props: ITextFieldHookProps): ReactNode {
    let {node, placeholder, style, ...more} = props;
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
            padding: "0.5em",
            ...style ?? {}
        }}
        placeholder={placeholder}
        onChange={event => new EventBus.Event({from: node, event: "inputChange", item: event.target.value})}
        {...more}>
        </input>
    );
}

export { type ITextFieldHookProps };
export { TextFieldHook };