import React, {type ReactNode} from "react";
import ColumnHook from "../../ColumnHook.tsx";

export default function TabItem(): ReactNode {
    return (
        <ColumnHook
        uniqueId="x"
        spring={{
            width: "20px",
            height: "100%",
            background: "#171717",
            borderRightColor: "#505050"
        }}
        style={{
            borderRightWidth: "0.5px",
            borderRightStyle: "solid",
            opacity: "0.2"
        }}>
        </ColumnHook>
    );
}