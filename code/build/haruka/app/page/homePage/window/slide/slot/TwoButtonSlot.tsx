import React, {type ReactNode} from "react";
import RowHook, {type RowHookProps} from "../../../../shared/components/layout/RowHook.tsx";

export interface TwoButtonSlotProps extends RowHookProps {}

export default function TwoButtonSlot(_props: TwoButtonSlotProps): ReactNode {
    const {uniqueId, children, ...more} = _props;
    return (
        <RowHook
        uniqueId={uniqueId}
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