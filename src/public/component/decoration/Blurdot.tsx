import type {ReactNode} from "react";
import type {FlexColProps} from "@component/FlexColProps";
import {FlexCol} from "@component/FlexCol";

export type BlurdotProps
    = 
    & FlexColProps 
    & {
        color0: string;
        color1: string;
    };

export function Blurdot(props: BlurdotProps): ReactNode {
    let {color0, color1, style, ... more} = props;
    return <>
        <FlexCol
        style={{
            background: `radial-gradient(closest-side, ${color0}, ${color1})`,
            opacity: "0.05",
            ... style ?? {}
        }}
        {... more}/>
    </>;
}