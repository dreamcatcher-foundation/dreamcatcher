import type {CSSProperties} from "react";
import React from "react";
import RemoteCol from "../remote/Col.tsx";
import {} from "react";

export default function SteelFrame({
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
})