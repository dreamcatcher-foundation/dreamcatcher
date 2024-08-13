import type { RowProps } from "@component/Row";
import { Row } from "@component/Row";
import React from "react";

export interface ImageProps extends RowProps {
    src: string;
}

export function Image(props: ImageProps): React.JSX.Element {
    let { src, style, children, ... more } = props;
    return <>
        <Row
        style={{
            backgroundImage: `url(${ src })`,
            backgroundSize: "cover",
            ... style ?? {}
        }}
        { ... more }/>
    </>;
}