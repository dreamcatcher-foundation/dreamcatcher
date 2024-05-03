import React, {type ReactNode, type ComponentPropsWithoutRef} from "react";

export interface ColumnProps extends ComponentPropsWithoutRef<"div"> {}

export default function Column(_props: ColumnProps): ReactNode {
    const {style, ...more} = _props;
    return (
        <div
        style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            ...style ?? {}
        }}
        {...more}/>
    );
}