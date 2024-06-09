import { type ReactNode } from "react";
import { type IColumnProps } from "@atlas/component/layout/Column.tsx";
import { Column } from "@atlas/component/layout/Column.tsx";
import React from "react";

interface ILayerProps extends IColumnProps {}

function Layer(props: ILayerProps): ReactNode {
    let {style, ...more} = props;
    return (
        <Column
        style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            overflow: "hidden",
            ...style ?? {}
        }}
        {...more}>
        </Column>
    );
}

export { type ILayerProps };
export { Layer };