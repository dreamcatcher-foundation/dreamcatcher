import React, {type CSSProperties} from "react";
import {RenderedCol} from "./Rendered.tsx";

export type RetroMinimaContainer = ({
    nodeId: string;
    w: string;
    h: string;
    initialClassName?: string;
    initialSpring?: object;
    initialSpringConfig?: object;
    initialStyle?: CSSProperties;
    childrenMountDelay?: bigint;
    childrenMountCooldown?: bigint;
    children?: (React.JSX.Element | (React.JSX.Element)[]);
    [k: string]: any;
});

export default function RetroMinimaContainer(props: RetroMinimaContainer) {
    const {
        nodeId,
        w,
        h,
        initialClassName,
        initialSpring,
        initialSpringConfig,
        initialStyle,
        childrenMountDelay,
        childrenMountCooldown,
        children,
        ...more
    } = props;

    const container = ({
        nodeId: nodeId,
        w: w,
        h: h,
        initialClassName: initialClassName,
        initialSpring: initialSpring,
        initialSpringConfig: initialSpringConfig,
        initialStyle: ({
            borderWidth: "1px",
            borderStyle: "solid",
            borderImage: "linear-gradient(to bottom, transparent, #505050, transparent) 1",
            background: "rgba(255, 255, 255, 0)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, .1)",
            backdropFilter: "blur(3.2px)",
            WebkitBackdropFilter: "blur(3.2px)",
            ...initialStyle ?? ({})
        }) as const,
        childrenMountDelay: childrenMountDelay,
        childrenMountCooldown: childrenMountCooldown,
        children: children,
        ...more
    });

    return (<RenderedCol {...container}></RenderedCol>);
}