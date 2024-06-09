import { type ReactNode } from "react";
import { type IHookProps } from "@atlas/component/Hook.tsx";
import { Hook } from "@atlas/component/Hook.tsx";
import React from "react";

interface IColumnHookProps extends IHookProps {}

function ColumnHook(props: IColumnHookProps): ReactNode {
    let {node, style, ...more} = props;
    return (
        <Hook
        node={node}
        style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            ...style ?? {}
        }}
        {...more}>
        </Hook>
    );
}

export { type IColumnHookProps };
export { ColumnHook };