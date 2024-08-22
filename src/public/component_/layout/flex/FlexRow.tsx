import type {ReactNode} from "react";
import type {FlexRowProps} from "src/public/component_/layout/flex/FlexRowProps";
import {Flex} from "src/public/component_/layout/flex/Flex";

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