import { type ReactNode } from "react";
import { type IColumnProps } from "@atlas/component/layout/Column.tsx";
import { Column } from "@atlas/component/layout/Column.tsx";
import React from "react";

interface IBlurDotProps extends IColumnProps {
    color0: string;
    color1: string;
}

function BlurDot(props: IBlurDotProps): ReactNode {
    let {color0, color1, style, ...more} = props;
    return (
        <Column
        style={{
            background: `radial-gradient(closest-side, ${color0}, ${color1})`,
            opacity: ".10",
            ...style ?? {}
        }}
        {...more}>
        </Column>
    );
}

export { type IBlurDotProps };
export { BlurDot };