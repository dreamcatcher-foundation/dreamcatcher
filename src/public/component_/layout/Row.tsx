import type { ColProps } from "@component/Col";
import { Col } from "@component/Col";
import React from "react";

export interface RowProps extends ColProps {}

export function Row(props: RowProps): React.JSX.Element {
    let { style, ... more } = props;
    return <>
        <Col
        style={{
            flexDirection: "row",
            ... style ?? {}
        }}
        { ... more }/>
    </>;
}