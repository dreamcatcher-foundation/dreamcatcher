import type {ComponentPropsWithoutRef} from "react";
import type {ReactNode} from "react";
import React from "react";

export type ColProps = ComponentPropsWithoutRef<"div">;

export default function Col(props: ColProps): ReactNode {
    const {
        style,
        ...more
    } = props;
    return <div {...{
        "style": {
            "display": "flex",
            "flexDirection": "column",
            "alignItems": "center",
            "justifyContent": "center",
            ...style ?? {}
        },
        ...more
    }}/>;
}