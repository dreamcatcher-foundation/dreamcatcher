import React, {type ReactNode} from "react";
import Base, {type BaseProps} from "../Base.tsx";

export type TextProps = BaseProps & {text: string};

export default function Text(props: TextProps): ReactNode {
    const {name, text, style, children, ...more} = props;
    return (
        <Base {...{
            name: name,
            style: {
                fontSize: "1em",
                fontFamily: "roboto mono",
                fontWeight: "bold",
                color: "white",
                background: "#D6D5D4",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                ...style ?? {}
            },
            children: text,
            ...more
        }}>
        </Base>
    );
}