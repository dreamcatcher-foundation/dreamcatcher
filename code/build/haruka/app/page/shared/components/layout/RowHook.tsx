import React, {type ReactNode} from "react";
import Hook, {type HookProps} from "../Hook.tsx";

export interface RowHookProps extends HookProps {}

export default function RowHook(_props: RowHookProps): ReactNode {
    const {uniqueId, style, ...more} = _props;
    return (
        <Hook
        uniqueId={uniqueId}
        style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            ...style ?? {}
        }}
        {...more}/>
    );
}