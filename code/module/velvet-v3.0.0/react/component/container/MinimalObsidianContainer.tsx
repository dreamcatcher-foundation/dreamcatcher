import type {CSSProperties} from "react";
import React from "react";
import SleekObsidianContainer from "./SleekObsidianContainer.tsx";

export default function MinimalObsidianContainer({
    address,
    initialClassName,
    initialSpring,
    initialSpringConfig,
    initialStyle,
    childrenMountDelay,
    childrenMountCooldown,
    children,
    ...more
}: {
    address: string;
    initialClassName?: string;
    initialSpring?: object;
    initialSpringConfig?: object;
    initialStyle?: CSSProperties;
    childrenMountDelay?: bigint;
    childrenMountCooldown?: bigint;
    children?: React.JSX.Element | (React.JSX.Element)[];
    [key: string]: any;
}): React.JSX.Element {
    return <SleekObsidianContainer {...{
        "address": address,
        "children": children,
        "childrenMountCooldown": childrenMountCooldown,
        "childrenMountDelay": childrenMountDelay,
        "initialClassName": initialClassName,
        "initialSpring": initialSpring,
        "initialSpringConfig": initialSpringConfig,
        "initialStyle": {
            "borderImage": "none",
            "borderColor": "#505050",
            ...initialStyle ?? {}
        },
        ...more
    }}/>;
}