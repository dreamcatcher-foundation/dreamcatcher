import React, {type ReactNode, type ComponentPropsWithoutRef} from "react";

export interface RowProps extends ComponentPropsWithoutRef<"div"> {}

export default function Row(_props: RowProps): ReactNode {
    const {style, ...more} = _props;
    return (
        <div
        style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            ...style ?? {}
        }}
        {...more}/>
    );
}