import type { ReactNode } from "react";
import type { IHookProps } from "../Hook.tsx";
import { Hook } from "../Hook.tsx";
import React from "react";

export interface ColumnHookProps extends IHookProps {}

export default function ColumnHook(_props: ColumnHookProps): ReactNode {
    const {nodeName, style, ...more} = _props;
    return (
        <Hook
        nodeName={nodeName}
        style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            ...style ?? {}
        }}
        {...more}/>
    );
}