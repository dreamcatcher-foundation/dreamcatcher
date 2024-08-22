import type {ReactNode} from "react";
import type {GridProps} from "@component/GridProps";
import {Base} from "@component/Base";

export function Grid({width, height, rowCount, colCount}: GridProps): ReactNode {
    return <Base
    style={{
        width: width,
        height: height,
        display: "grid",
        gridTemplateRows: `repeat(${Number(rowCount)}, 1fr)`,
        gridTemplateColumns: `repeat(${Number(colCount)}, 1fr)`
    }}/>;
}