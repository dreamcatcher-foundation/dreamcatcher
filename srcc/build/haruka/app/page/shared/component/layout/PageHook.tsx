import type { ReactNode } from "react";
import type { }

import React, {type ReactNode} from "react";
import ColumnHook, {type ColumnHookProps} from "./ColumnHook.tsx";

export interface PageHookProps extends ColumnHookProps {}

export default function PageHook(_props: PageHookProps): ReactNode {
    const {nodeKey: uniqueId, style, ...more} = _props;
    return (
        <ColumnHook
        nodeKey={uniqueId}
        style={{
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            background: "#161616",
            ...style ?? {}
        }}
        {...more}/>
    );
}