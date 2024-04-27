import React from "react";
import {Link} from "react-router-dom";
import RemoteText from "../Text.tsx";

export default function NavbarItem({
    address,
    text0,
    text1,
    link}: {
        address: string;
        text0: string;
        text1: string;
        link: string;}): React.JSX.Element {
    return <Link {...{
        "to": link,
        "style": {
            "gap": "10px",
            "textDecoration": "none",
            "color": "white",
            "display": "flex",
            "flexDirection": "row",
            "justifyContent": "center",
            "alignItems": "center"
        },
        "children": [
            <RemoteText {...{
                "address": `${address}__Text0`,
                "initialText": text0,
                "initialStyle": {
                    "background": "#615FFF",
                    "fontSize": "15px",
                    "display": "flex",
                    "flexDirection": "row",
                    "justifyContent": "center",
                    "alignItems": "center"
                }
            }}/>,
            <RemoteText {...{
                "address": `${address}__Text1`,
                "initialText": text1,
                "initialStyle": {
                    "fontSize": "15px",
                    "display": "flex",
                    "flexDirection": "row",
                    "alignItems": "center"
                }
            }}/>
        ]
    }}/>;
}