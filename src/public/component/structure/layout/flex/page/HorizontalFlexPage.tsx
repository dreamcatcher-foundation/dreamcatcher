import type {ReactNode} from "react";
import type {HorizontalFlexPageProps} from "@component/HorizontalFlexPageProps";
import {FlexRow} from "@component/FlexRow";

export function HorizontalFlexPage({width, height, justifyContent, alignItems, ... more}: HorizontalFlexPageProps): ReactNode {
    return <FlexRow
    width="100vw"
    minWidth="100vw"
    maxWidth="auto"
    height="100vh"
    minHeight="100vh"
    maxHeight="100vh"
    justifyContent="start"
    alignItems="center"
    {... more}/>
}