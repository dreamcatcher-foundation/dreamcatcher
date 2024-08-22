import type {ReactNode} from "react";
import type {BaseProps} from "@component/BaseProps";
import type {SizeProps} from "@component/SizeProps";
import type {FlexItemProps} from "@component/FlexItemProps";
import {Base} from "@component/Base";

export function FlexItem(
    props:
        & BaseProps
        & SizeProps
        & FlexItemProps
): ReactNode {
    let {order, flexGrow, flexShrink, flexBasis, style, ... more} = props;
    return <>
        <Base
        style={{
            order: typeof order === "bigint" ? Number(order) : order,
            flexGrow,
            flexShrink,
            flexBasis,
            ... style ?? {}
        }}
        {... more}/>
    </>;
}