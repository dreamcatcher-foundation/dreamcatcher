import { type ReactNode } from "react";
import { type IColumnHookProps } from "@atlas/component/layout/ColumnHook.tsx";
import { ColumnHook } from "@atlas/component/layout/ColumnHook.tsx";
import React from "react";

interface IPhantomSteelFrameHook extends IColumnHookProps {
    direction?: string;
}

function PhantomSteelFrameHook(props: IPhantomSteelFrameHook): ReactNode {
    let {node, direction, style, ...more} = props;
    return (
        <ColumnHook
        node={node}
        style={{
            borderWidth: "1px",
            borderStyle: "solid",
            borderImage: `linear-gradient(${direction ?? "to bottom"}, transparent, #505050) 1`,
            ...style ?? {}
        }}
        {...more}>
        </ColumnHook>
    );
}

export { type IPhantomSteelFrameHook };
export { PhantomSteelFrameHook };