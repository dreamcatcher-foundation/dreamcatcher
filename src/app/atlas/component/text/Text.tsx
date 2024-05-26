import { type ReactNode } from "react";
import { type ComponentPropsWithoutRef } from "react";
import React from "react";

interface ITextProps extends ComponentPropsWithoutRef<"div"> {
    text: string;
}

function Text(props: ITextProps): ReactNode {
    let {style, text, ...more} = props;
    return (
        <div
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
        </div>
    );
}

export { type ITextProps };
export { Text };