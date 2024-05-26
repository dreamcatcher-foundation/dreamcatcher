import React, {type ReactNode} from "react";
import Column, {type ColumnProps} from "./Column.tsx";

export interface LayerProps extends ColumnProps {}

export default function Layer(_props: LayerProps): ReactNode {
    const {style, ...more} = _props;
    return (
        <Column
        style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            overflow: "hidden",
            ...style ?? {}
        }}
        {...more}/>
    );
}