import type {CSSProperties} from "react";
import React from "react";
import Remote from "../Remote.tsx";

export default function BlurDot({
    remoteId,
    remoteClassName,
    remoteSpring,
    remoteSpringConfig,
    remoteStyle,
    children,
    childrenMountDelay,
    childrenMountCooldown,
    color0,
    color1,
    ...more
}: {
    remoteId: string;
    remoteClassName?: string;
    remoteSpring?: object;
    remoteSpringConfig?: object;
    remoteStyle?: CSSProperties;
    color0: string;
    color1: string;
    [key: string]: any;
}): React.JSX.Element {
    return (
        <Remote {...{
            "remoteId": remoteId,
            "remoteClassName": remoteClassName,
            "remoteSpring": remoteSpring,
            "remoteSpringConfig": remoteSpringConfig,
            "remoteStyle": {
                "background": `radial-gradient(closest-side, ${color0}, ${color1})`,
                "opacity": ".10",
                ...remoteStyle ?? {}
            },
            ...more
        }}>
        </Remote>
    );
}