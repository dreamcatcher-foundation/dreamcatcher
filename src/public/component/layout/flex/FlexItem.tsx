import type {ReactNode} from "react";
import type {FlexItemProps} from "@component/layout/flex/FlexItemProps";
import {Base} from "@component/base/Base";

export function FlexItem(props: FlexItemProps): ReactNode {
    let {width, height, order, flexGrow, flexShrink, flexBasis, style, ... more} = props;
    return <>
        <Base
        style={{
            width: width,
            height: height,
            order: typeof order === "bigint" ? Number(order) : order,
            flexGrow: flexGrow,
            flexShrink: flexShrink,
            flexBasis: flexBasis === "auto" ? undefined : flexBasis,
            ... style ?? {}
        }}
        {... more}/>
    </>;
}