import React, {type ReactNode, type ComponentPropsWithoutRef} from "react";

export interface TextProps extends ComponentPropsWithoutRef<"div"> {
    text: string;
}

export default function Text(_props: TextProps): ReactNode {
    const {style, text, ...more} = _props;
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