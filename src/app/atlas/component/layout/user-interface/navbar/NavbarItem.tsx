import { type ReactNode } from "react";
import { Text } from "@atlas/component/text/Text.tsx";
import { Link } from "react-router-dom";
import React from "react";

interface INavbarItemProps {
    text0: string;
    text1: string;
    link: string;
}

function NavbarItem(props: INavbarItemProps): ReactNode {
    let {text0, text1, link} = props;
    return (
        <Link
        to={link}
        style={{
            gap: "10px",
            textDecoration: "none",
            color: "white",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        }}
        className="swing-in-top-fwd">
            <Text
            text={text0}
            style={{
                background: "#615FFF",
                fontSize: "15px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center" 
            }}>
            </Text>

            <Text
            text={text1}
            style={{
                fontSize: "15px",
                display: "15px",
                flexDirection: "row",
                alignItems: "center"
            }}>
            </Text>
        </Link>
    );
}

export { type INavbarItemProps };
export { NavbarItem };