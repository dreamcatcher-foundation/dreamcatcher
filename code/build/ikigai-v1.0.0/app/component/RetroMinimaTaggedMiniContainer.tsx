import React, {type CSSProperties} from "react";
import {Col} from "./Base.tsx";
import {RenderedCol, RenderedText} from "./Rendered_.tsx";

export type RetroMinimaTaggedMiniContainerProps = ({
    nodeId: string;
    initialClassName?: string;
    initialSpring?: object;
    initialSpringConfig?: object;
    initialStyle?: CSSProperties;
    childrenMountDelay?: bigint;
    childrenMountCooldown?: bigint;
    children?: (React.JSX.Element | (React.JSX.Element)[]);
    wrapperWidth: string;
    wrapperHeight: string;
    tagInitialClassName?: string;
    tagInitialSpring?: object;
    tagInitialSpringConfig?: object;
    tagInitialStyle?: CSSProperties;
    tagInitialText?: string;
    [k: string]: any;
});

export default function RetroMinimaTaggedMiniContainer(props: RetroMinimaTaggedMiniContainerProps) {
    const {
        nodeId,
        initialClassName,
        initialSpring,
        initialSpringConfig,
        initialStyle,
        wrapperWidth, 
        wrapperHeight,
        tagInitialClassName,
        tagInitialSpring,
        tagInitialSpringConfig,
        tagInitialStyle, 
        tagInitialText,
        children,
        ...more
    } = props;

    const wrapper = ({
        style: ({
            width: wrapperWidth,
            height: wrapperHeight,
            position: "absolute"
        }) as const
    });

    const container0 = ({
        nodeId: nodeId,
        w: "100%",
        h: "100%",
        initialStyle: ({
            position: "absolute",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "#D6D5D4",
            padding: "15px",
            ...initialStyle ?? ({})
        }) as const,
        initialClassName: initialClassName,
        initialSpring: initialSpring,
        initialSpringConfig: initialSpringConfig,
        children: children,
        ...more
    });

    const container1 = ({
        style: ({
            width: "100%",
            height: "100%",
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            background: "transparent"
        }) as const
    });

    const tagDarkContainer = ({
        style: ({
            width: "auto",
            height: "auto",
            background: "#161616",
            position: "relative",
            bottom: "5px"
        }) as const
    });

    const tagContainer = ({
        style: ({
            width: "auto",
            height: "auto",
            background: "#D6D5D4",
            paddingLeft: "2px",
            paddingRight: "2px",
            marginLeft: "10px",
            marginRight: "10px"
        }) as const
    });

    const tag = ({
        nodeId: `${nodeId}Tag`,
        initialStyle: ({
            width: "auto",
            height: "auto",
            background: "#161616",
            fontSize: ".75em",
            ...tagInitialStyle ?? ({})
        }) as const,
        initialText: tagInitialText ?? ""
    });

    return (
        <Col {...wrapper}>
            <RenderedCol {...container0}></RenderedCol>
            <Col {...container1}>
                <Col {...tagDarkContainer}>
                    <Col {...tagContainer}>
                        <RenderedText {...tag}></RenderedText>
                    </Col>
                </Col>
            </Col>
        </Col>
    );
}