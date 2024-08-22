import type {ReactNode} from "react";
import type {FlexColProps} from "@component/FlexColProps";
import {Base} from "@component/Base";

export function FlexCol(props: FlexColProps): ReactNode {
    let {style, ... more} = props;
    return <>
        <Base
        style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            ... style ?? {}
        }}
        {... more}/>
    </>;
}