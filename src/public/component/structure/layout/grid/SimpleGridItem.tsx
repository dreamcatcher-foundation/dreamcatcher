import type {ReactNode} from "react";
import type {SimpleGridItemProps} from "@component/SimpleGridItemProps";
import {Base} from "@component/Base";

export function SimpleGridItem(props: SimpleGridItemProps): ReactNode {
    let {start, end, style, ... more} = props;
    return <>
        <Base
        style={{
            gridRowStart: Number(start.x),
            gridRowEnd: Number(end.x),
            gridColumnStart: Number(start.y),
            gridColumnEnd: Number(end.y),
            ... style ?? {}
        }}
        {... more}/>
    </>;
}