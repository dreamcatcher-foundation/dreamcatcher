import React, {type ReactNode} from "react";
import Base, {type BaseProps} from "../HookableAnimatedDiv.tsx";

export type PulseLine = BaseProps;

export default function PulseLine(props: PulseLine): ReactNode {
    const {name, style, ...more} = props;
    return (
        <Base {...{
            name: name,
            style: {
                width: "100%",
                height: ".50px",
                background: "linear-gradient(to right, transparent, rgba(163, 163, 163, 0.25), transparent)",
                ...style ?? {}
            },
            ...more
        }}>
        </Base>
    );
}