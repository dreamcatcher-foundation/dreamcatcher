import type {ReactNode} from "react";
import type {FlexSlideProps} from "@component/structure/layout/flex/page/slide/FlexSlideProps";
import {FlexCol} from "@component/FlexCol";

export function FlexSlide(props: FlexSlideProps): ReactNode {
    let {style, ... more} = props;
    return <>
        <FlexCol
        style={{
            width: "100vw",
            minWidth: "100vw",
            maxWidth: "100vw",
            height: "100vh",
            minHeight: "100vh",
            maxHeight: "100vh",
            justifyContent: "center",
            alignItems: "center",
            ... style ?? {}
        }}
        {... more}/>
    </>;
}