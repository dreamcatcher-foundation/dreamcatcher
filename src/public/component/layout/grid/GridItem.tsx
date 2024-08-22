import type {ReactNode} from "react";
import type {GridItemProps} from "@component/layout/grid/GridItemProps";
import {Base} from "@component/base/Base";

export function GridItem(props: GridItemProps): ReactNode {
    let {coordinate0, coordinate1, style, ... more} = props;
    return <>
        <Base
        style={{
            gridRowStart: Number(coordinate0.x),
            gridRowEnd: Number(coordinate1.x),
            gridColumnStart: Number(coordinate0.y),
            gridColumnEnd: Number(coordinate1.y),
            ... style ?? {}
        }}
        {... more}/>
    </>;
}