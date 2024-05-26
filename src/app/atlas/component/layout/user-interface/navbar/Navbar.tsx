import { type IRowHookProps } from "@atlas/component/layout/RowHook.tsx";
import { type ReactNode } from "react";
import { RowHook } from "@atlas/component/layout/RowHook.tsx";
import React from "react";

interface INavbarProps extends IRowHookProps {}

function Navbar(props: INavbarProps): ReactNode {
    let {node, style, childrenMountDelay, childrenMountCooldown, ...more} = props;
    return (
        <RowHook
        node={node}
        style={{
            width: "auto",
            height: "auto",
            gap: "30px",
            ...style ?? {}
        }}
        childrenMountDelay={childrenMountDelay ?? 25n}
        childrenMountCooldown={childrenMountCooldown ?? 100n}
        {...more}>
        </RowHook>
    );
}

export { type INavbarProps };
export { Navbar };