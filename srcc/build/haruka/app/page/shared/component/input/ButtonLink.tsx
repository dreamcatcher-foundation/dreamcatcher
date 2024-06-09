import React, {type ReactNode} from "react";
import ButtonHook, {type ButtonHookProps} from "./ButtonHook.tsx";
import {Link} from "react-router-dom";

export interface ButtonLinkProps extends ButtonHookProps {
    link: string;
}

export default function ButtonLink(_props: ButtonLinkProps): ReactNode {
    const {nodeKey: uniqueId, color, link, ...more} = _props;
    return (
        <Link
        to={link}
        style={{
            textDecoration: "none"
        }}>
            <ButtonHook
            nodeKey={uniqueId}
            color={color}
            {...more}>
            </ButtonHook>
        </Link>
    );
}