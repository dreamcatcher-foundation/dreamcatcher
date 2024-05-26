import type {ReactNode} from "react";
import type {RenderedProps} from "../rendered/Rendered.tsx";
import Rendered from "../rendered/Rendered.tsx";

export type PulseLine = RenderedProps;

export default function PulseLine(props: PulseLine): ReactNode {
    let {style, ...more} = props;
    return <Rendered {...{
        style: {
            width: "100%",
            height: "0.50px",
            background: "linear-gradient(to right, transparent, rgba(163, 163, 163, 0.25), transparent)",
            ...style ?? {}
        },
        ...more
    }}>
    </Rendered>
}