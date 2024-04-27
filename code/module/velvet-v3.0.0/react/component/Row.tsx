import type {RemoteProps} from "./Remote.tsx";
import type {ReactNode} from "react";
import React from "react";
import Remote from "./Remote.tsx";

export type RowProps = RemoteProps;

export default function Row(props: RowProps): ReactNode {
    const {
        remoteId,
        style,
        ...more
    } = props;
    return <Remote {...{
        "remoteId": remoteId,
        "style": {
            "display": "flex",
            "flexDirection": "row",
            "justifyContent": "center",
            "alignItems": "center",
            ...style ?? {}
        },
        ...more
    }}/>;
}