import type {RenderedColumnProps} from "./RenderedColumn.tsx";
import type {ReactNode} from "react";
import React from "react";
import RenderedColumn from "./RenderedColumn.tsx";

export type RenderedPageProps = RenderedColumnProps;

export default function RenderedPage(props: RenderedPageProps): ReactNode {
    const {style, ...more} = props;
    return <RenderedColumn {...{
        style: {
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            background: "#161616",
            ...style ?? {}
        },
        ...more
    }}/>;
}