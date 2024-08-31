import type {ReactNode} from "react";
import type {ComponentPropsWithRef} from "react";
import {DualLabelButton} from "@component/DualLabelButton";
import {Link} from "react-router-dom";

export type DualLabelLinkProps
    =
    & ComponentPropsWithRef<typeof Link>
    & {
        label0: string;
        label1: string;
        size: number;
        color: string;
        onClick: Function;
    };

export function DualLabelLink(props: DualLabelLinkProps): ReactNode {
    let {label0, label1, size, color, onClick, style, ... more} = props;
    return <>
        <Link
        style={{
            width: "auto",
            height: "auto",
            ... style ?? {}
        }}
        {... more}>
            <DualLabelButton
            label0={label0}
            label1={label1}
            size={size}
            color={color}
            onClick={onClick}/>
        </Link>
    </>;
}