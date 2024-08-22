import type {ReactNode} from "react";
import type {FlexProps} from "src/public/component_/layout/flex/FlexProps";
import {Base} from "src/public/component_/base/Base";

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