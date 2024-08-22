import type {ReactNode} from "react";
import type {FlexRowProps} from "@component/FlexRowProps";
import {Base} from "@component/Base";

export function FlexRow(props: FlexRowProps): ReactNode {
    let {style, ... more} = props;
    return <>
        <Base
        style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            ... style ?? {}
        }}
        {... more}/>
    </>;
}