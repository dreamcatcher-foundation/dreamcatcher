import { type ReactNode } from "react"
import { type ComponentPropsWithoutRef } from "react";
import React from "react";

interface IPhantomSteelHorizontalLineProps extends ComponentPropsWithoutRef<"div"> {}

function PhantomSteelHorizontalLine(props: IPhantomSteelHorizontalLineProps): ReactNode {
    let {style, ...more} = props;
    return (
        <div
        style={{
            width: "100%",
            height: "0.50px",
            background: "linear-gradient(to right, transparent, rgba(163, 163, 163, 0.25), transparent)",
            ...style ?? {}
        }}
        {...more}>
        </div>
    );
}

export { type IPhantomSteelHorizontalLineProps };
export { PhantomSteelHorizontalLine };