import type {RenderedColumnProps} from "./RenderedColumn.tsx";
import type {ReactNode} from "react";
import React from "react";
import RenderedColumn from "./RenderedColumn.tsx";

export type RenderedRowProps = RenderedColumnProps;

export default function RenderedRow(props: RenderedRowProps): ReactNode {
    const {style, ...more} = props;
    return <RenderedColumn {...{
        style: {
            flexDirection: "row",
            ...style ?? {}
        },
        ...more
    }}/>;
}