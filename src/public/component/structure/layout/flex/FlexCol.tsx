import type {ReactNode} from "react";
import type {FlexColProps} from "@component/FlexColProps";
import {Flex} from "@component/Flex";

export function FlexCol(props: FlexColProps): ReactNode {
    let {... more} = props;
    return <>
        <Flex
        flexDirection="column"
        {... more}/>
    </>;
}