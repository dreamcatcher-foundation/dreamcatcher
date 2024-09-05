import type {ReactNode} from "react";
import type {ComponentPropsWithRef} from "react";
import {RetroMinimaButton} from "@component/retro-minima/RetroMinimaButton";
import {Link} from "react-router-dom";

export interface RetroMinimaLinkProps extends ComponentPropsWithRef<typeof Link> {
    to: string;
    caption: string;
}

export function RetroMinimaLink({
    caption,
    ... more
}: RetroMinimaLinkProps): ReactNode {
    return <><Link {... more}><RetroMinimaButton caption={caption}/></Link></>;
}