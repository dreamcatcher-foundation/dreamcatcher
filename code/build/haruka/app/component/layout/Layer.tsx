import React, {type ReactNode} from "react";
import Col, {type ColProps} from "./Col.tsx";

export type LayerProps = ColProps;

export default function Layer(props: LayerProps): ReactNode {
    const {name, style, ...more} = props;
    return (
        <Col {...{
            name: name,
            style: {
                width: "100%",
                height: "100%",
                position: "absolute",
                overflow: "hidden",
                ...style ?? {}
            },
            ...more
        }}>
        </Col>
    );
}