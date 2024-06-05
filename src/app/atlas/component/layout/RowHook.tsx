import { type IHookProps } from "@atlas/component/Hook.tsx";
import { Hook } from "@atlas/component/Hook.tsx";
import React from "react";

export interface IRowHookProps extends IHookProps {}

export function RowHook(props: IRowHookProps): React.ReactNode {
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