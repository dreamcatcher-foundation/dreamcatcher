import type { ReactNode } from "@HarukaToolkitBundle";
import type { ComponentPropsWithoutRef } from "@HarukaToolkitBundle";
import React from "react";

export interface RowProps extends ComponentPropsWithoutRef<"div"> {}

export default function Row(_props: RowProps): ReactNode {
    let {style, ...more} = _props;
    return (
        <div
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