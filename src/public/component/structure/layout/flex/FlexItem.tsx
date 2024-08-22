import type {ReactNode} from "react";
import type {FlexItemProps} from "@component/FlexItemProps";
import {Base} from "@component/Base";

export function FlexItem({width, height, order, flexGrow, flexShrink, flexBasis, children}: FlexItemProps): ReactNode {
    return <Base
    style={{
        order: typeof order === "bigint" ? Number(order) : order,
        width,
        height,
        flexGrow,
        flexShrink,
        flexBasis
    }}>
        {children}
    </Base>;
}