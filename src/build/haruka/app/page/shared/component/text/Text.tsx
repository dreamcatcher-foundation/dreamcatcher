import type { ReactNode } from "@HarukaToolkitBundle";
import type { ComponentPropsWithoutRef  } from "@HarukaToolkitBundle";
import React from "react";

interface ITextProps extends ComponentPropsWithoutRef<"div"> {
    text: string;
}

function Text(_props: ITextProps): ReactNode {
    let {style, text, ...more} = _props;
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

export type { ITextProps };
export { Text };