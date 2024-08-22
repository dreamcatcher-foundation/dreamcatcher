import type {ReactNode} from "react";
import type {VerticalFlexPageProps} from "@component/VerticalFlexPageProps";
import {FlexCol} from "@component/FlexCol";

export function VerticalFlexPage(props: VerticalFlexPageProps): ReactNode {
    let {style, ... more} = props;
    return <>
        <FlexCol
        style={{
            width: "100vw",
            minWidth: "100vw",
            maxWidth: "100vw",
            height: "100vh",
            minHeight: "100vh",
            justifyContent: "start",
            alignItems: "center",
            ... style ?? {}
        }}
        {... more}/>
    </>;
}