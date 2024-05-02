import React, {type ReactNode} from "react";
import Base, {type BaseProps} from "../HookableAnimatedDiv.tsx";

export type BlurDotProps = BaseProps & {
    color0: string;
    color1: string;
};

export default function BlurDot(props: BlurDotProps): ReactNode {
    const {color0, color1, style, ...more} = props;
    return (
        <Base {...{
            style: {
                background: `radial-gradient(closest-side, ${color0}, ${color1})`,
                opacity: ".10",
                ...style ?? {}
            },
            ...more
        }}>
        </Base>
    );
}