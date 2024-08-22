import type {ReactNode} from "react";
import type {FlexRowProps} from "@component/FlexRowProps";
import {Flex} from "@component/Flex";

export function FlexRow(props: FlexRowProps): ReactNode {
    let {... more} = props;
    return <>
        <Flex
        flexDirection="row"
        {... more}/>
    </>;
}