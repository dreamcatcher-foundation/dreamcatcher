import React, {type ReactNode} from "react";
import RowHook, {type RowHookProps} from "../../RowHook.tsx";

export interface NavbarProps extends RowHookProps {}

export default function Navbar(_props: NavbarProps): ReactNode {
    const {nodeKey: uniqueId, style, ...more} = _props;
    return (
        <RowHook
        nodeKey={uniqueId}
        style={{
            width: "auto",
            height: "auto",
            gap: "30px",
            ...style ?? {}
        }}
        childrenMountDelay={25n}
        childrenMountCooldown={100n}
        {...more}/>
    );
}