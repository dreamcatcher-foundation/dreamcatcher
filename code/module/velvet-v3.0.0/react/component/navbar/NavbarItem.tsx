import type {ReactNode} from "react";
import {Link} from "react-router-dom";
import RenderedText from "../rendered/RenderedText.tsx";
import UniqueTag from "../../../event/UniqueTag.ts";

export type NavbarItemProps = {
    textTag0?: UniqueTag;
    textTag1?: UniqueTag;
    text0?: string;
    text1?: string;
    link?: string;
};

export default function NavbarItem(props: NavbarItemProps): ReactNode {
    let {textTag0, textTag1, text0, text1, link} = props;
    textTag0 = textTag0 ?? new UniqueTag();
    textTag1 = textTag1 ?? new UniqueTag();
    text0 = text0 ?? "";
    text1 = text1 ?? "";
    link = link ?? "";
    return <Link {...{
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
        <RenderedText {...{
            tag: textTag0,
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
        </RenderedText>
        <RenderedText {...{
            tag: textTag1,
            text: text1,
            style: {
                fontSize: "15px",
                display: "15px",
                flexDirection: "row",
                alignItems: "center"
            }
        }}>
        </RenderedText>
    </Link>;
}