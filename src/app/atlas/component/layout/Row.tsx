import { type ReactNode } from "react";
import { type ComponentPropsWithoutRef } from "react";
import React from "react";

interface IRowProps extends ComponentPropsWithoutRef<"div"> {}

function Row(props: IRowProps): ReactNode {
    let {style, ...more} = props;
    return (
        <div
        style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            ...style ?? {}
        }}
        {...more}>
        </div>
    );
}

export { type IRowProps };
export { Row };