import type {RemoteProps} from "../rendered/Rendered.tsx";
import type {ReactNode} from "react";
import React from "react";
import ColRemote from "./ColRemote.tsx";

export type PageRemoteProps = RemoteProps;

export default function PageRemote(props: PageRemoteProps): ReactNode {
    const {
        remoteId,
        style,
        ...more
    } = props;
    return <ColRemote {...{
        "remoteId": remoteId,
        "style": {
            "width": "100vw",
            "height": "100vh",
            "overflow": "hidden",
            "background": "#161616",
            ...style ?? {}
        },
        ...more
    }}/>;
}
