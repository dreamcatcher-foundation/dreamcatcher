import type {ReactNode} from "react";
import type {SimpleGridProps} from "@component/SimpleGridProps";
import {Base} from "@component/Base";

export function SimpleGrid(props: SimpleGridProps): ReactNode {
    let {rowCount, colCount, style, ... more} = props;
    return <>
        <Base
        style={{
            display: "grid",
            gridTemplateRows: `repeat(${Number(rowCount)}, 1fr)`,
            gridTemplateColumns: `repeat(${Number(colCount)}, 1fr)`,
            ... style ?? {}
        }}
        {... more}/>
    </>;
}