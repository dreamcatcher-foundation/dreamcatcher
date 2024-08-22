import type {ReactNode} from "react";
import type {FlexItemProps} from "src/public/component_/layout/flex/FlexItemProps";
import {Base} from "src/public/component_/base/Base";

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