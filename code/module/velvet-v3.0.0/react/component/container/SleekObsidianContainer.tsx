import type {CSSProperties} from "react";
import React from "react";
import RemoteCol from "../remote/RemoteCol.tsx";

export default function SleekObsidianContainer({
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
    return <RemoteCol {...{
        "address": address,
        "initialClassName": initialClassName,
        "initialSpring": initialSpring,
        "initialSpringConfig": initialSpringConfig,
        "initialStyle": {
            "background": "#171717",
            "borderWidth": "1px",
            "borderStyle": "solid",
            "borderImage": "linear-gradient(to bottom, transparent, #505050) 1",
            "padding": "2.5%",
            "justifyContent": "space-between",
            "overflowX": "hidden",
            "overflowY": "auto",
            ...initialStyle ?? {}
        },
        "childrenMountDelay": childrenMountDelay,
        "childrenMountCooldown": childrenMountCooldown,
        "children": children,
        ...more
    }}/>;
}