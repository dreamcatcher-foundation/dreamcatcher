import React, {type ReactNode} from "react";
import RowHook, {type RowHookProps} from "../../../../shared/component/layout/RowHook.tsx";

export interface TwoButtonSlotProps extends RowHookProps {}

export default function TwoButtonSlot(_props: TwoButtonSlotProps): ReactNode {
    const {nodeKey: uniqueId, children, ...more} = _props;
    return (
        <RowHook
        nodeKey={uniqueId}
        childrenMountCooldown={100n}
        style={{
            width: "100%",
            height: "auto",
            gap: "10px"
        }}
        {...more}>
            {children}
        </RowHook>
    );
}