import type {RemoteProps} from "./Remote.tsx";
import type {ReactNode} from "react";
import React from "react";
import Remote from "./Remote.tsx";

export type ColProps = RemoteProps;

export default function Col(props: ColProps): ReactNode {
    const {
        remoteId,
        style,
        ...more
    } = props;
    return <Remote {...{
        "remoteId": remoteId,
        "style": {
            "display": "flex",
            "flexDirection": "column",
            "justifyContent": "center",
            "alignItems": "center",
            ...style ?? {}
        },
        ...more
    }}/>;
}