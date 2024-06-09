import type {RemoteProps} from "../rendered/Rendered.tsx";
import type {ReactNode} from "react";
import React from "react";
import Remote from "../rendered/Rendered.tsx";

export type ColRemoteProps = RemoteProps;

export default function ColRemote(props: ColRemoteProps): ReactNode {
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