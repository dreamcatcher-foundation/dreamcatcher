import React, {type ReactNode} from "react";
import RowHook, {type RowHookProps} from "../../RowHook.tsx";

export interface TabProps extends RowHookProps {}

export default function Tab(_props: TabProps): ReactNode {
    const {uniqueId, children, ...more} = _props;
    return (
        <RowHook
        uniqueId={uniqueId}
        style={{
            width: "10%",
            height: "100%",
            justifyContent: "start"
        }}
        {...more}>
            {children}
        </RowHook>
    );
}