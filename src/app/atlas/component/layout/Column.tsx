import { type ReactNode } from "react";
import { type ComponentPropsWithoutRef } from "react";
import React from "react";

interface IColumnProps extends ComponentPropsWithoutRef<"div"> {}

function Column(props: IColumnProps): ReactNode {
    let {style, ...more} = props;
    return (
        <div
        style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            ...style ?? {}
        }}
        {...more}>
        </div>
    );
}

export { type IColumnProps };
export { Column };