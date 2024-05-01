import React, {type ReactNode} from "react";
import Text from "../../text/Text.tsx";
import {Link} from "react-router-dom";

export type NavbarItemProps = {
    textName0: string;
    textName1: string;
    text0: string;
    text1: string;
    link: string;
};

export default function NavbarItem(props: NavbarItemProps): ReactNode {
    const {textName0, textName1, text0, text1, link} = props;
    return (
        <Link {...{
            to: link,
            style: {
                gap: "10px",
                textDecoration: "none",
                color: "white",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
            }
        }}>
            <Text {...{
                name: textName0,
                text: text0,
                style: {
                    background: "#615FFF",
                    fontSize: "15px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                }
            }}>
            </Text>
            <Text {...{
                name: textName1,
                text: text1,
                style: {
                    fontSize: "15px",
                    display: "15px",
                    flexDirection: "row",
                    alignItems: "center"
                }
            }}>
            </Text>
        </Link>
    );
}