import type {ReactNode} from "react";
import type {HorizontalFlexPageProps} from "@component/HorizontalFlexPageProps";
import {FlexRow} from "@component/FlexRow";

export function HorizontalFlexPage(props: HorizontalFlexPageProps): ReactNode {
    let {style, ... more} = props;
    return <>
        <FlexRow
        style={{
            width: "100vw",
            minWidth: "100vw",
            height: "100vh",
            minHeight: "100vh",
            maxHeight: "100vh",
            justifyContent: "start",
            alignItems: "start",
            ... style ?? {}
        }}
        {... more}/>
    </>;
}