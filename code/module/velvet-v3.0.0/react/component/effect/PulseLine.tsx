import type {CSSProperties} from "react";
import React from "react";
import Remote from "../Remote.tsx";

export default function PulseLine({
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
        <Remote {...{
            "remoteId": remoteId,
            "remoteClassName": remoteClassName,
            "remoteSpring": remoteSpring,
            "remoteSpringConfig": remoteSpringConfig,
            "remoteStyle": {
                "width": "100%",
                "height": "0.50px",
                "background": "linear-gradient(to right, transparent, rgba(163, 163, 163, 0.25), transparent)",
                ...remoteStyle ?? {}
            },
            "childrenMountDelay": childrenMountDelay,
            "childrenMountCooldown": childrenMountCooldown,
            ...more
        }}>
            {children}
        </Remote>
    );
}