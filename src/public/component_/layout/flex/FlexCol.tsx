import type {ReactNode} from "react";
import type {FlexColProps} from "src/public/component_/layout/flex/FlexColProps";
import {Flex} from "src/public/component_/layout/flex/Flex";

export function FlexCol(props: FlexColProps): ReactNode {
    let {width, height, justifyContent, alignItems, ... more} = props;
    return <>
        <Flex
        width={width}
        height={height}
        flexDirection="column"
        justifyContent={justifyContent}
        alignItems={alignItems}
        {... more}/>
    </>;
}