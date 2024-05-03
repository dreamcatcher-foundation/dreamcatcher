import React, {type ReactNode} from "react";
import Hook, {type HookProps} from "../Hook.tsx";

export interface ColumnHookProps extends HookProps {}

export default function ColumnHook(_props: ColumnHookProps): ReactNode {
    const {uniqueId, style, ...more} = _props;
    return (
        <Hook
        uniqueId={uniqueId}
        style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            ...style ?? {}
        }}
        {...more}/>
    );
}