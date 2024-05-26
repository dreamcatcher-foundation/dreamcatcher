import { type ReactNode } from "react";
import { type IHookProps } from "@atlas/component/Hook.tsx";
import { Hook } from "@atlas/component/Hook.tsx";
import React from "react";

interface IRowHookProps extends IHookProps {}

function RowHook(props: IRowHookProps): ReactNode {
    let {node, style, ...more} = props;
    return (
        <Hook
        node={node}
        style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            ...style ?? {}
        }}
        {...more}>
        </Hook>
    );
}

export { type IRowHookProps };
export { RowHook };