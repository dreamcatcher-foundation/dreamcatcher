import React, {type ReactNode, type ComponentPropsWithoutRef} from "react";

export interface PhantomSteelHorizontalLineProps extends ComponentPropsWithoutRef<"div"> {}

export default function PhantomSteelHorizontalLine(_props: PhantomSteelHorizontalLineProps): ReactNode {
    const {style, ...more} = _props;
    return (
        <div
        style={{
            width: "100%",
            height: ".50px",
            background: "linear-gradient(to right, transparent, rgba(163, 163, 163, 0.25), transparent)",
            ...style ?? {}
        }}
        {...more}/>
    );
}