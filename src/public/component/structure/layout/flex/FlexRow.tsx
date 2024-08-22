import type {ReactNode} from "react";
import type {FlexRowProps} from "@component/FlexRowProps";
import {Flex} from "@component/Flex";

export function FlexRow({width, height, justifyContent, alignItems}: FlexRowProps): ReactNode {
    return <Flex
    width={width}
    height={height}
    flexDirection="row"
    justifyContent={justifyContent}
    alignItems={alignItems}/>
}