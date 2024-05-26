import { type ReactNode } from "react";
import { type IRowHookProps } from "@atlas/component/layout/RowHook.tsx";
import { RowHook } from "@atlas/component/layout/RowHook.tsx";
import React from "react";

interface IHeadingSlotProps extends IRowHookProps {}

function HeadingSlot(props: IHeadingSlotProps): ReactNode {
    let {node, children, style, ...more} = props;
    return (
        <RowHook
        node={node}
        childrenMountCooldown={100n}
        style={{
            width: "100%",
            height: "auto",
            ...style ?? {}
        }}
        {...more}>
            {children}
        </RowHook>
    );
}

export { type IHeadingSlotProps };
export { HeadingSlot };