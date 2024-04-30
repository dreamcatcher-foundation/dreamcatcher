import type {RenderedColumnProps} from "./RenderedColumn.tsx";
import type {ReactNode} from "react";
import React from "react";
import RenderedColumn from "./RenderedColumn.tsx";

export type RenderedLayerProps = RenderedColumnProps;

export default function RenderedLayer(props: RenderedLayerProps): ReactNode {
    const {style, ...more} = props;
    return <RenderedColumn {...{
        style: {
            width: "100%",
            height: "100%",
            position: "absolute",
            overflow: "hidden",
            ...style ?? {}
        },
        ...more
    }}/>;
}