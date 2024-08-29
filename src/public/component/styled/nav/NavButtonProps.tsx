import type {ComponentPropsWithRef} from "react";
import type {Link} from "react-router-dom";

export type NavButtonProps
    =
    & ComponentPropsWithRef<typeof Link>
    & {
        caption0: string;
        caption1: string;
    };