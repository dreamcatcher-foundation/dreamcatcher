import type {CSSProperties} from "react";
import React from "react";
import Col from "./Col.tsx";

export default function Layer({
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
                "width": "100%",
                "height": "100%",
                "position": "absolute",
                "overflow": "hidden",
                ...remoteStyle ?? {}
            },
            "childrenMountDelay": childrenMountDelay,
            "childrenMountCooldown": childrenMountCooldown,
            ...more
        }}>
            {children}
        </Col>
    );
}