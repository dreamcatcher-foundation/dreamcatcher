import type {ReactNode} from "react";
import type {GridItemProps} from "@component/GridItemProps";
import {Base} from "@component/Base";

export function GridItem({start, end, children}: GridItemProps): ReactNode {
    return <Base
    style={{
        gridRowStart: Number(start.x),
        gridRowEnd: Number(end.x),
        gridColumnStart: Number(start.y),
        gridColumnEnd: Number(end.y)
    }}>
        {children}
    </Base>;
}