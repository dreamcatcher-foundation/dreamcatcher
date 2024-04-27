import type {CSSProperties} from "react";
import React from "react";
import RemoteRow from "../Row.tsx";

export default function Navbar({
    address,
    initialClassName,
    initialSpring,
    initialSpringConfig,
    initialStyle,
    childrenMountDelay,
    childrenMountCooldown,
    children,
    ...more}: {
        address: string;
        initialClassName?: string;
        initialSpring?: object;
        initialSpringConfig?: object;
        initialStyle?: CSSProperties;
        childrenMountDelay?: bigint;
        childrenMountCooldown?: bigint;
        children?: React.JSX.Element | (React.JSX.Element)[];}): React.JSX.Element {
    return <RemoteRow {...{
        "address": address,
        "initialClassName": initialClassName,
        "initialSpring": initialSpring,
        "initialSpringConfig": initialSpringConfig,
        "initialStyle": {
            "width": "auto%",
            "height": "auto",
            "gap": "30px",
            ...initialStyle ?? {}
        },
        "childrenMountDelay": childrenMountDelay,
        "childrenMountCooldown": childrenMountCooldown,
        "children": children,
        ...more
    }}/>;
}