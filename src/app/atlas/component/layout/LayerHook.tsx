import { type ReactNode } from "react";
import { type IColumnHookProps } from "@atlas/component/layout/ColumnHook.tsx";
import { ColumnHook } from "@atlas/component/layout/ColumnHook.tsx";
import React from "react";

interface ILayerHookProps extends IColumnHookProps {}

function LayerHook(props: ILayerHookProps): ReactNode {
    let {node, style, ...more} = props;
    return (
        <ColumnHook
        node={node}
        style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            overflow: "hidden",
            ...style ?? {}
        }}
        {...more}>
        </ColumnHook>
    );
}

export { type ILayerHookProps };
export { LayerHook };