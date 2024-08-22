import type {ReactNode} from "react";
import type {SizeProps} from "@component/SizeProps";
import type {BaseProps} from "@component/BaseProps";
import type {FlexProps} from "@component/FlexProps";
import {Base} from "@component/Base";

export function Flex(
    props:
        & BaseProps
        & SizeProps
        & FlexProps
): ReactNode {
    let {flexDirection, justifyContent, alignItems, style, ... more} = props;
    return <>
        <Base
        style={{
            display: "flex",
            flexDirection,
            justifyContent,
            alignItems,
            ... style ?? {}
        }}
        {... more}/>
    </>;
}