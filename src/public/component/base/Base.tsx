import type {ReactNode} from "react";
import type {BaseProps} from "@component/BaseProps";
import {animated} from "react-spring";

export function Base(props: BaseProps): ReactNode {
    return <>
        <animated.div {... props}/>
    </>;
}