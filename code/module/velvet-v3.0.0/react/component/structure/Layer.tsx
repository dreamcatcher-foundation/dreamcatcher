import type {ColProps} from "./Col.tsx";
import type {ReactNode} from "react";
import React from "react";
import Col from "./Col.tsx";

export type LayerProps = ColProps;

export default function Layer(props: LayerProps): ReactNode {
    const {
        style,
        ...more
    } = props;
    return <Col {...{
        "style": {
            "width": "100%",
            "height": "100%",
            "position": "absolute",
            "overflow": "hidden",
            ...style ?? {}
        },
        ...more
    }}/>;
}