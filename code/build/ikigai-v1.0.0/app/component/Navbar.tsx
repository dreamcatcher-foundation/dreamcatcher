import type {CSSProperties} from "react";
import React from "react";
import {Link} from "react-router-dom";
import {RenderedText, RenderedRow} from "./Rendered_.tsx";

export type INavbarItemProps = ({
    nodeId: string;
    text0: string;
    text1: string;
    to: string;
    [k: string]: any;
});

export function NavbarItem(props: INavbarItemProps) {
    const {nodeId, text0, text1, to, ...more} = props;

    const args = ({
        to: to,
        style: ({
            gap: "10px",
            textDecoration: "none",
            color: "white",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        }),
        ...more
    }) as const;

    const textArgs0 = ({
        nodeId: `${nodeId}Text0`,
        initialText: text0,
        initialStyle: ({
            background: "#615FFF",
            fontSize: "15px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        })
    }) as const;

    const textArgs1 = ({
        nodeId: `${nodeId}Text1`,
        initialText: text1,
        initialStyle: ({
            fontSize: "15px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        })
    }) as const;

    return (
        <Link {...args}>
            <RenderedText {...textArgs0}></RenderedText>
            <RenderedText {...textArgs1}></RenderedText>
        </Link>
    );
}

export type INavbarProps = ({
    initialStyle?: CSSProperties;
    [k: string]: any;
});

export function Navbar(props: INavbarProps) {
    const {initialStyle, ...more} = props;

    const args = ({
        nodeId: "NavbarRow",
        w: "100%",
        h: "auto",
        childrenMountDelay: 100n,
        childrenMountCooldown: 100n,
        initialStyle: ({
            gap: "30px",
            ...initialStyle ?? ({})
        }),
        ...more
    }) as const;

    return (<RenderedRow {...args}></RenderedRow>);
}