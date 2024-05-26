import { type ReactNode } from "react";
import { type IColumnHookProps } from "@atlas/component/layout/ColumnHook.tsx";
import { ColumnHook } from "@atlas/component/layout/ColumnHook.tsx";
import React from "react";

interface ISlideProps extends IColumnHookProps {}

function Slide(props: ISlideProps): ReactNode {
    let {node, style, children, ...more} = props;
    return (
        <ColumnHook
        node={node}
        style={{
            width: "100%",
            height: "100%",
            overflowX: "hidden",
            overflowY: "auto",
            padding: "20px",
            justifyContent: "center",
            gap: "5px",
            ...style ?? {}
        }}
        childrenMountCooldown={100n}
        {...more}>
            {children}
        </ColumnHook>
    );
}

export { type ISlideProps };
export { Slide };