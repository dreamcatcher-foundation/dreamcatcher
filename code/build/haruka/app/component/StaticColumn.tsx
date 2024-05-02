import React, {type ReactNode, type ComponentPropsWithoutRef} from "react";

export type StaticColumnProps = ComponentPropsWithoutRef<"div">;

export default function StaticColumn(props: StaticColumnProps): ReactNode {
    const {style, ...more} = props;
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