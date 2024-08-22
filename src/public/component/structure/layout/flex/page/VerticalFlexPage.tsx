import type {ReactNode} from "react";
import type {VerticalFlexPageProps} from "@component/VerticalFlexPageProps";
import {FlexCol} from "@component/FlexCol";

export function VerticalPage({width, height, justifyContent, alignItems, ... more}: VerticalFlexPageProps): ReactNode {
    return <FlexCol
    width="100vw"
    minWidth="100vw"
    maxWidth="100vw"
    height="100vh"
    minHeight="100vh"
    maxHeight="auto"
    justifyContent="start"
    alignItems="center"
    {... more}/>;
}