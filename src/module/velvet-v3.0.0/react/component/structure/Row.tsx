import type {ComponentPropsWithoutRef} from "react";
import type {ReactNode} from "react";
import React from "react";

export type RowProps = ComponentPropsWithoutRef<"div">;

export default function Row(props: RowProps): ReactNode {
    const {
        style,
        ...more
    } = props;
    return <div {...{
        "style": {
            "display": "flex",
            "flexDirection": "row",
            "alignItems": "center",
            "justifyContent": "center",
            ...style ?? {}
        },
        ...more
    }}/>;
}