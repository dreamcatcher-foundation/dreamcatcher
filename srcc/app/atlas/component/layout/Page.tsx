import { type IColumnProps } from "@atlas/component/layout/Column.tsx";
import { Column } from "@atlas/component/layout/Column.tsx";
import React from "react";

interface IPageProps extends IColumnProps {}

function Page(props: IPageProps): React.ReactNode {
    let {style, ...more} = props;
    return (
        <Column
        style={{
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            background: "#161616",
            ...style ?? {}
        }}
        {...more}>
        </Column>
    );
}

export { type IPageProps };
export { Page };