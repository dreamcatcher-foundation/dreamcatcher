import React, {type ReactNode} from "react";
import Col, {type ColProps} from "../HookableAnimatedColumn.tsx";

export type PageProps = ColProps;

export default function Page(props: PageProps): ReactNode {
    const {name, style, ...more} = props;
    return (
        <Col {...{
            name: name,
            style: {
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                background: "#161616",
                ...style ?? {}
            },
            ...more
        }}>
        </Col>
    );
}