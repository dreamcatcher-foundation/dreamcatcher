import type { ReactNode } from "@HarukaToolkitBundle";
import type { IHookProps } from "../Hook.tsx";
import { Hook } from "../Hook.tsx";
import React from "react";

export interface IRowHookProps extends IHookProps {}

export default function RowHook(_props: IRowHookProps): ReactNode {
    let {nodeName, style, ...more} = _props;
    return (
        <Hook
        nodeName={nodeName}
        style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            ...style ?? {}
        }}
        {...more}/>
    );
}