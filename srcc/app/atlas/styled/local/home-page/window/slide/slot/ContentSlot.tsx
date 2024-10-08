import { type ReactNode } from "react";
import { type IRowHookProps } from "@atlas/component/layout/RowHook.tsx";
import { RowHook } from "@atlas/component/layout/RowHook.tsx";
import React from "react";

interface IContentSlotProps extends IRowHookProps {}

function ContentSlot(props: IContentSlotProps): ReactNode {
    let {node, children, style, ...more} = props;
    return (
        <RowHook
        node={node}
        childrenMountCooldown={100n}
        style={{
            width: "100%",
            height: "auto",
            ...style ?? {}
        }}>
            {children}
        </RowHook>
    );
}

export { type IRowHookProps };
export { ContentSlot };