import type { ReactNode } from "react";
import type { ComponentPropsWithoutRef } from "react";
import React from "react";

interface IColumnProps extends ComponentPropsWithoutRef<"div"> {}

function Column(args: IColumnProps): ReactNode {
    let {style, ...more} = args;
    return (
        <div
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

export type { IColumnProps };
export { Column };