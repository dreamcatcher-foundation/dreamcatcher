import type {ReactNode} from "react";
import type {BaseProps} from "src/public/component_/base/BaseProps";
import {animated} from "react-spring";

export function Base(props: BaseProps): ReactNode {
    return <>
        <animated.div {... props}/>
    </>;
}