import { type ReactNode } from "react";
import { type IButtonHookProps } from "@atlas/component/input/ButtonHook.tsx";
import { ButtonHook } from "@atlas/component/input/ButtonHook.tsx";
import { Link } from "react-router-dom";
import React from "react";

interface ILinkedButtonHookProps extends IButtonHookProps {
    link: string;
}

function LinkedButtonHook(props: ILinkedButtonHookProps): ReactNode {
    let {node, color, link, ...more} = props;
    return (
        <Link
        to={link}
        style={{
            textDecoration: "none"
        }}>
            <ButtonHook
            node={node}
            color={color}
            {...more}>
            </ButtonHook>
        </Link>
    );
}

export { type ILinkedButtonHookProps };
export { LinkedButtonHook };