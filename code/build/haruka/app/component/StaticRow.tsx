import React, {type ReactNode, type ComponentPropsWithoutRef} from "react";

export type StaticRowProps = ComponentPropsWithoutRef<"div">;

export default function StaticRow(props: StaticRowProps): ReactNode {
    const {style, ...more} = props;
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