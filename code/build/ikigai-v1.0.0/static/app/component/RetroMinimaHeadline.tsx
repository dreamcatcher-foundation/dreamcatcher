import React, {type CSSProperties} from "react";
import {RenderedCol} from "./Rendered.tsx";

export type RetroMinimaHeadline = ({
    nodeId: string;
    initialClassName?: string;
    initialSpring?: object;
    initialSpringConfig?: object;
    initialStyle?: CSSProperties;
    childrenMountDelay?: bigint;
    childrenMountCooldown?: bigint;
    tagNodeId: string;
    tagInitialClassName?: string;
    tagInitialSpring?: object;
    tagInitialSpringConfig?: object;
    tagInitialStyle?: CSSProperties;
    tagInitialText?: string;
    [k: string]: any;
});

export default function RetroMinimaHeadline(props: RetroMinimaHeadline) {
    const {
        nodeId,
        initialClassName,
        initialSpring,
        initialSpringConfig,
        initialStyle,
        childrenMountDelay,
        childrenMountCooldown,
        w,
        h,
        tagNodeId,
        tagInitialClassName,
        tagInitialSpring,
        tagInitialSpringConfig,
        tagInitialStyle,
        tagInitialText,
        ...more
    } = props;

    const container = ({
        initialStyle: ({
            width: "auto",
            height: "auto",
            background: "#D6D5D4",
            paddingLeft: "2px",
            paddingRight: "2px",
            ...initialStyle ?? ({})
        }) as const,
        nodeId: nodeId,
        initialClassName: initialClassName,
        initialSpring: initialSpring,
        initialSpringConfig: initialSpringConfig,
        childrenMountDelay: childrenMountDelay,
        childrenMountCooldown: childrenMountCooldown,

        ...more
    });

    const tag = ({

    })
}