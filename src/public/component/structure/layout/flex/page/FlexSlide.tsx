import type {ReactNode} from "react";
import type {FlexSlideProps} from "@component/FlexSlideProps";
import {FlexCol} from "@component/FlexCol";

export function FlexSlide({width, height, minWidth, maxWidth, minHeight, maxHeight, justifyContent, alignItems, ... more}: FlexSlideProps): ReactNode {
    return <FlexCol
    width={width ?? }
    height=""
    {... more}/>
}