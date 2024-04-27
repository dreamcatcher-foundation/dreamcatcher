import type {CSSProperties} from "react";
import React from "react";
import Col from "./Col.tsx";

export default function Page({
    remoteId,
    remoteClassName,
    remoteSpring,
    remoteSpringConfig,
    remoteStyle,
    children,
    childrenMountDelay,
    childrenMountCooldown,
    ...more
}: {
    remoteId: string;
    remoteClassName?: string;
    remoteSpring?: object;
    remoteSpringConfig?: object;
    remoteStyle?: CSSProperties;
    children?: React.JSX.Element | (React.JSX.Element)[];
    childrenMountDelay?: bigint;
    childrenMountCooldown?: bigint;
    [key: string]: any;
}): React.JSX.Element {
    return (
        <Col {...{
            "remoteId": remoteId,
            "remoteClassName": remoteClassName,
            "remoteSpring": remoteSpring,
            "remoteSpringConfig": remoteSpringConfig,
            "remoteStyle": {
                "width": "100vw",
                "height": "100vh",
                "overflow": "hidden",
                "background": "#161616",
                ...remoteStyle ?? {}
            },
            ...more
        }}>
            {children}
        </Col>
    );
}