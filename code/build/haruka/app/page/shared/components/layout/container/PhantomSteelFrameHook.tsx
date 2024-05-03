import React, {type ReactNode} from "react";
import ColumnHook, {type ColumnHookProps} from "../ColumnHook.tsx";

export interface PhantomSteelFrameHookProps extends ColumnHookProps {
    phantomSteelFrameDirection?: string;
}

export default function PhantomSteelFrameHook(_props: PhantomSteelFrameHookProps): ReactNode {
    const {uniqueId, phantomSteelFrameDirection, style, ...more} = _props;
    return (
        <ColumnHook
        uniqueId={uniqueId}
        style={{
            borderWidth: "1px",
            borderStyle: "solid",
            borderImage: `linear-gradient(${phantomSteelFrameDirection ?? "to bottom"}, transparent, #505050) 1`,
            ...style ?? {}
        }}
        {...more}/>
    );
}