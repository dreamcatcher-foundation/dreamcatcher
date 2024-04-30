import type {RemoteProps} from "../rendered/Rendered.tsx";
import type {ReactNode} from "react";
import React from "react";
import ColRemote from "./ColRemote.tsx";

export type LayerRemoteProps = RemoteProps;

export default function LayerRemote(props: LayerRemoteProps): ReactNode {
    const {
        remoteId,
        style,
        ...more
    } = props;
    return <ColRemote {...{
        "remoteId": remoteId,
        "style": {
            "width": "100%",
            "height": "100%",
            "position": "absolute",
            "overflow": "hidden",
            ...style ?? {}
        },
        ...more
    }}/>;
}