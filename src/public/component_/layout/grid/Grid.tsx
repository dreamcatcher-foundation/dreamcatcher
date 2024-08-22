import type {ReactNode} from "react";
import type {GridProps} from "src/public/component_/layout/grid/GridProps";
import {Base} from "src/public/component_/base/Base";

export function Grid(props: GridProps): ReactNode {
    let {width, height, rowCount, colCount, style, ... more} = props;
    return <>
        <Base
        style={{
            width: width,
            height: height,
            display: "grid",
            gridTemplateRows: `repeat(${Number(rowCount)}, 1fr)`,
            gridTemplateColumns: `repeat(${Number(colCount)}, 1fr)`,
            ... style ?? {} 
        }}
        {... more}/>
    </>;
}