import React from "react";
import type {CSSProperties} from "react";
import Remote from "../Remote.tsx";
import RemoteText from "../Text.tsx";
import {defaultEventsHub} from "../../../event/hub/DefaultEventsHub.ts";

export default function Button1({
    address,
    text,
    initialClassName,
    initialSpring,
    initialSpringConfig,
    initialStyle,
    ...more}: {
        address: string;
        text: string;
        initialClassName?: string;
        initialSpring?: object;
        initialSpringConfig?: object;
        initialStyle?: CSSProperties;
        [key: string]: any;
}): React.JSX.Element {
    return <Remote {...{
        "address": address,
        "initialClassName": initialClassName,
        "initialSpring": {
            "background": "#171717",
            "boxShadow": "0px 0px 32px 2px #615FFF",
            "borderColor": "#615FFF",
            ...initialSpring ?? {}
        },
        "initialStyle": {
            "width": "200px",
            "height": "50px",
            "display": "flex",
            "flexDirection": "row",
            "justifyContent": "center",
            "alignItems": "center",
            "borderStyle": "solid",
            "borderWidth": "1px",
            ...initialStyle ?? {}
        },
        "onMouseEnter": () => defaultEventsHub.post(address, "SpringRenderRequest", {
            "boxShadow": "0px 0px 32px 8px #6C69FF",
            "borderColor": "#6C69FF",
            "cursor": "pointer"
        }),
        "onMouseLeave": () => defaultEventsHub.post(address, "SpringRenderRequest", {
            "boxShadow": "0px 0px 32px 2px #615FFF",
            "borderColor": "#615FFF",
            "cursor": "auto"
        }),
        "onClick": () => defaultEventsHub.post(address, "Click"),
        "children": [
            <RemoteText {...{
                "address": `${address}__Text`,
                "initialText": text,
                "initialStyle": {
                    "fontSize": "15px"
                }
            }}/>
        ],
        "initialSpringConfig": initialSpringConfig,
        ...more
    }}/>;
}