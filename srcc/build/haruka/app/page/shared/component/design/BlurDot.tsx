import React, {type ReactNode} from "react";
import Column, {type ColumnProps} from "../layout/Column";

export interface BlurDotProps extends ColumnProps {
    color0: string;
    color1: string;
}

export default function BlurDot(_props: BlurDotProps): ReactNode {
    const {color0, color1, style, ...more} = _props;
    return (
        <Column
        style={{
            background: `radial-gradient(closest-side, ${color0}, ${color1})`,
            opacity: ".10",
            ...style ?? {}
        }}
        {...more}/>
    );
}