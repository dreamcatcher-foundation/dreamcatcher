import { type ReactNode } from "react";
import { type IColumnHookProps } from "@atlas/component/layout/ColumnHook.tsx";
import { ColumnHook } from "@atlas/component/layout/ColumnHook.tsx";
import React from "react";

interface IObsidianContainerWithPhantomSteelFrameHook extends IColumnHookProps {
    direction?: string;
}

function ObsidianContainerWithPhantomSteelFrameHook(props: IObsidianContainerWithPhantomSteelFrameHook): ReactNode {
    let {node, direction, style, ...more} = props;
    return (
        <ColumnHook
        node={node}
        style={{
            background: "#171717",
            borderWidth: "1px",
            borderStyle: "solid",
            borderImage: `linear-gradient(${direction ?? "to bottom"}, transparent, #505050) 1`,
            padding: "2.5%",
            justifyContent: "space-between",
            overflowX: "hidden",
            overflowY: "auto",
            ...style ?? {}
        }}
        {...more}>
        </ColumnHook>
    );
}

export { type IObsidianContainerWithPhantomSteelFrameHook };
export { ObsidianContainerWithPhantomSteelFrameHook };