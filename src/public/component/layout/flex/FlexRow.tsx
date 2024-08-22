import type {ReactNode} from "react";
import type {FlexRowProps} from "@component/layout/flex/FlexRowProps";
import {Flex} from "@component/layout/flex/Flex";

export function FlexRow(props: FlexRowProps): ReactNode {
    let {width, height, justifyContent, alignItems, ... more} = props;
    return <>
        <Flex
        width={width}
        height={height}
        flexDirection="row"
        justifyContent={justifyContent}
        alignItems={alignItems}
        {... more}/>
    </>;
}