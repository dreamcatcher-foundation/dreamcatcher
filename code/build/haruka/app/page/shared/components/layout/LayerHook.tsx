import React, {type ReactNode} from "react";
import ColumnHook, {type ColumnHookProps} from "./ColumnHook.tsx";

export interface LayerHookProps extends ColumnHookProps {}

export default function LayerHook(_props: LayerHookProps): ReactNode {
    const {uniqueId, style, ...more} = _props;
    return (
        <ColumnHook
        uniqueId={uniqueId}
        style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            overflow: "hidden",
            ...style ?? {}
        }}
        {...more}/>
    );
}