import type {RenderedProps} from "./Rendered.tsx";
import type {ReactNode} from "react";
import React from "react";
import Rendered from "./Rendered.tsx";

export type RenderedColumnProps = RenderedProps;

export default function RenderedColumn(props: RenderedColumnProps): ReactNode {
    const {style, ...more} = props;
    return <Rendered {...{
        style: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            ...style ?? {}
        },
        ...more
    }}/>;
}