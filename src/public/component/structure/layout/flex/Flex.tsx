import type {ReactNode} from "react";
import type {FlexProps} from "@component/FlexProps";
import {Base} from "@component/Base";

export function Flex({width, height, flexDirection, justifyContent, alignItems, children}: FlexProps): ReactNode {
    return <Base
    style={{
        display: "flex",
        width,
        height,
        flexDirection,
        justifyContent,
        alignItems
    }}>
        {children}
    </Base>;
}