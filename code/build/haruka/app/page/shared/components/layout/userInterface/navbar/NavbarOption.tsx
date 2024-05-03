import React, {type ReactNode} from "react";
import Text from "../../../text/Text.tsx";
import {Link} from "react-router-dom";

export interface NavbarOptionProps {
    text0: string;
    text1: string;
    link: string;
}

export default function NavbarOption(_props: NavbarOptionProps): ReactNode {
    const {text0, text1, link} = _props;
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
            }}/>

            <Text
            text={text1}
            style={{
                fontSize: "15px",
                display: "15px",
                flexDirection: "row",
                alignItems: "center"
            }}/>
        </Link>
    );
}