import React, {type ReactNode} from "react";
import Column, {type ColumnProps} from "./Column.tsx";

export interface PageProps extends ColumnProps {}

export default function Page(_props: PageProps): ReactNode {
    const {style, ...more} = _props;
    return (
        <Column
        style={{
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            background: "#161616",
            ...style ?? {}
        }}
        {...more}/>
    );
}