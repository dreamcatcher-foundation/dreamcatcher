import type {ComponentPropsWithoutRef} from "react";
import type {ReactNode} from "react";

export type TextProps = ComponentPropsWithoutRef<"div"> & {
    text: string;
};

export default function Text(props: TextProps): ReactNode {
    const {
        text,
        style,
        children,
        ...more
    } = props;
    return <div {...{
        "style": {
            "fontSize": "1em",
            "fontFamily": "roboto mono",
            "fontWeight": "bold",
            "color": "white",
            "background": "D6D5D4",
            "WebkitBackgroundClip": "text",
            "WebkitTextFillColor": "transparent",
            ...style ?? {}
        },
        "children": text,
        ...more
    }}/>;
}