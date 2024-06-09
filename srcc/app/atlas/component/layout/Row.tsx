import React from "react";

export interface IRowProps extends React.ComponentPropsWithoutRef<"div"> {}

export function Row(props: IRowProps): React.ReactNode {
    let {style, ...more} = props;
    return (
        <div
        style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            ...style ?? {}
        }}
        {...more}>
        </div>
    );
}