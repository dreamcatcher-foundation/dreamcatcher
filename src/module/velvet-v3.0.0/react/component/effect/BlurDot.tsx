import type {ReactNode} from "react";
import type {RenderedProps} from "../rendered/Rendered.tsx";
import Rendered from "../rendered/Rendered.tsx";

export type BlurDotProps = RenderedProps & {
    color0: string;
    color1: string;
};

export default function BlurDot(props: BlurDotProps): ReactNode {
    let {color0, color1, style, ...more} = props;
    return <Rendered {...{
        style: {
            background: `radial-gradient(closest-side, ${color0}, ${color1})`,
            opacity: "0.10",
            ...style ?? {}
        },
        ...more
    }}>
    </Rendered>;
}