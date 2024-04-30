import type {ColProps} from "./Col.tsx";
import type {ReactNode} from "react";
import React from "react";
import Col from "./Col.tsx";

export type PageProps = ColProps;

export default function Page(props: PageProps): ReactNode {
    const {
        style,
        ...more
    } = props;
    return <Col {...{
        "style": {
            "width": "100vw",
            "height": "100vh",
            "overflow": "hidden",
            "background": "#161616",
            ...style ?? {}
        },
        ...more
    }}/>;
}