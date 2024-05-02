import HookableAnimatedDiv, {type HookableAnimatedDivProps} from "./HookableAnimatedDiv.tsx";
import React, {type ReactNode} from "react";

export type HookableAnimatedColumnProps = HookableAnimatedDivProps;

export default function HookableAnimatedColumn(props: HookableAnimatedColumnProps): ReactNode {
    const {uniqueId, style, ...more} = props;
    return (
        <HookableAnimatedDiv
        uniqueId={uniqueId}
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