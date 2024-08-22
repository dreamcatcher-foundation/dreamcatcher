import type {ReactNode} from "react";
import type {FlexColProps} from "@component/FlexColProps";
import {Flex} from "@component/Flex";

export function FlexCol({width, height, justifyContent, alignItems}: FlexColProps): ReactNode {
    return <Flex
    width={width}
    height={height}
    flexDirection="column"
    justifyContent={justifyContent}
    alignItems={alignItems}/>
}