import React, {type CSSProperties} from "react";
import {Col} from "./Base.tsx";
import {RenderedCol, RenderedText} from "./Rendered_.tsx";

export type IRetroMinimaHeadline = ({
    nodeId: string;
    initialText: string;
    initialStyle?: CSSProperties;
    [k: string]: any;
});

export function RetroMinimaHeadline(props: IRetroMinimaHeadline) {
    const {nodeId, initialText, ...more} = props;

    return (<Col {...({
        style: ({
            width: "auto",
            height: "auto",
            background: "#D6D5D4",
            paddingLeft: "2px",
            paddingRight: "2px"
        }) as const,
        ...more,
        children: ([
            <RenderedText {...({
                nodeId: nodeId,
                initialStyle: ({
                    width: "auto",
                    height: "auto",
                    background: "#161616"
                }) as const,
                initialText: initialText
            })}/>
        ])
    })}/>);
}

export type IRetroMinimaTagProps = ({
    nodeId: string;
    initialText: string;
    [k: string]: any;
});

export function RetroMinimaTag(props: IRetroMinimaTagProps) {
    const {nodeId, initialText, ...more} = props;

    return (<Col {...({
        style: ({
            width: "auto",
            height: "auto",
            background: "#161616"
        }) as const,
        children: ([
            <Col {...({
                style: ({
                    width: "auto",
                    height: "auto",
                    background: "#D6D5D4",
                    paddingLeft: "2px",
                    paddingRight: "2px",
                    marginLeft: "10px",
                    marginRight: "10px"
                }) as const,
                children: ([
                    <RenderedText {...({
                        nodeId: nodeId,
                        initialStyle: ({
                            width: "auto",
                            height: "auto",
                            background: "#161616",
                            fontSize: ".75em"
                        }) as const,
                        initialText: initialText
                    })}/>
                ])
            })}/>
        ]),
        ...more
    })}/>);
}


