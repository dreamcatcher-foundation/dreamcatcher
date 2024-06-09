import type { ReactNode } from "react";
import type { IColumnProps } from "./Column.tsx";
import { Column } from "./Column.tsx";
import React from "react";

interface IPageProps extends IColumnProps {}

function Page(args: IPageProps): ReactNode {
    let {style, ...more} = args;
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

export type { IPageProps };
export { Page };