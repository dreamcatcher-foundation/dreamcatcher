import type {ReactNode} from "react";
import type {FlexProps} from "@component/layout/flex/FlexProps";
import {Base} from "@component/base/Base";

export function Flex(props: FlexProps): ReactNode {
    let {width, height, flexDirection, justifyContent, alignItems, style, ... more} = props;
    return <>
        <Base
        style={{
            width: width,
            height: height,
            display: "flex",
            flexDirection: flexDirection,
            justifyContent: justifyContent,
            alignItems: alignItems,
            ... style ?? {}
        }}
        {... more}/>
    </>;
}