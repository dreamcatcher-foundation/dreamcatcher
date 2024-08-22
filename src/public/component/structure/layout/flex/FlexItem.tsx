import type {ReactNode} from "react";
import type {FlexItemProps} from "@component/FlexItemProps";
import {Base} from "@component/Base";

export function FlexItem(props: FlexItemProps): ReactNode {
    let {style, ... more} = props;
    return <>
        <Base
        style={{
            order: 0,
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: "auto",
            ... style ?? {}
        }}
        {... more}/>
    </>;
}