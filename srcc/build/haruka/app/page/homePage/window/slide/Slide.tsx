import React, {type ReactNode} from "react";
import ColumnHook, {type ColumnHookProps} from "../../../shared/component/layout/ColumnHook.tsx";

export interface SlideProps extends ColumnHookProps {}

export default function Slide(_props: SlideProps): ReactNode {
    const {nodeKey: uniqueId, style, children, ...more} = _props;
    return (
        <ColumnHook
        nodeKey={uniqueId}
        style={{
            width: "100%",
            height: "100%",
            overflowX: "hidden",
            overflowY: "auto",
            padding: "20px",
            justifyContent: "space-between",
            gap: "5px",
            ...style ?? {}
        }}
        childrenMountCooldown={100n}
        {...more}>
            {children}
        </ColumnHook>
    );
}