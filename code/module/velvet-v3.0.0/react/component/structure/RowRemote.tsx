import type {RemoteProps} from "../rendered/Rendered.tsx";
import type {ReactNode} from "react";
import React from "react";
import Remote from "../rendered/Rendered.tsx";

export type RowRemoteProps = RemoteProps;

export default function Row(props: RowRemoteProps): ReactNode {
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