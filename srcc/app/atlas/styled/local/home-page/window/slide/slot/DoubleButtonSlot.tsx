import { type ReactNode } from "react";
import { type IRowHookProps } from "@atlas/component/layout/RowHook.tsx";
import { RowHook } from "@atlas/component/layout/RowHook.tsx";
import React from "react";

interface IDoubleButtonSlotProps extends IRowHookProps {}

function DoubleButtonSlot(props: IDoubleButtonSlotProps): ReactNode {
    let {node, children, style, ...more} = props;
    return (
        <RowHook
        node={node}
        childrenMountCooldown={100n}
        style={{
            width: "100%",
            height: "auto",
            gap: "10px",
            ...style ?? {}
        }}
        {...more}>
            {children}
        </RowHook>
    );
}

export { type IDoubleButtonSlotProps };
export { DoubleButtonSlot };