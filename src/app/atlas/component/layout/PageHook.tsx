import { type ReactNode } from "react";
import { type IColumnHookProps } from "@atlas/component/layout/ColumnHook.tsx";
import { ColumnHook } from "@atlas/component/layout/ColumnHook.tsx";

interface IPageHookProps extends IColumnHookProps {}

function PageHook(props: IPageHookProps): ReactNode {
    let {node, style, ...more} = props;
    return (
        <ColumnHook
        node={node}
        style={{
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            background: "#161616",
            ...style ?? {}
        }}
        {...more}>
        </ColumnHook>
    );
}

export { type IPageHookProps };
export { PageHook };