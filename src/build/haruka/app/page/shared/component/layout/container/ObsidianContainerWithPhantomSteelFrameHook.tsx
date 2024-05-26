import React, {type ReactNode} from "react";
import ColumnHook, {type ColumnHookProps} from "../ColumnHook.tsx";

export interface ObsidianContainerWithPhantomSteelFrameHookProps extends ColumnHookProps {
    phantomSteelFrameDirection?: string;
}

export default function ObsidianContainerWithPhantomSteelFrameHook(_props: ObsidianContainerWithPhantomSteelFrameHookProps): ReactNode {
    const {nodeKey: uniqueId, phantomSteelFrameDirection, style, ...more} = _props;
    return (
        <ColumnHook
        nodeKey={uniqueId}
        style={{
            background: "#171717",
            borderWidth: "1px",
            borderStyle: "solid",
            borderImage: `linear-gradient(${phantomSteelFrameDirection ?? "to bottom"}, transparent, #505050) 1`,
            padding: "2.5%",
            justifyContent: "space-between",
            overflowX: "hidden",
            overflowY: "auto",
            ...style ?? {}
        }}
        {...more}/>
    );
}