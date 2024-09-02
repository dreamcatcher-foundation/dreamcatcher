import type { ReactNode } from "react";
import { NavBrand } from "@component/NavBrand";
import { NavButton } from "@component/NavButton";
import { NavConnectButton } from "@component/NavConnectButton";
import { NavAccount } from "./NavAccount";
import { FlexRow } from "@component/FlexRow";

export function Nav(): ReactNode {
    return <>
        <FlexRow
        style={{
        width: "1024px",
        height: "auto",
        justifyContent: "space-between",
        paddingTop: "20px",
        paddingBottom: "20px",
        paddingLeft: "20px",
        paddingRight: "20px"
        }}>
            <FlexRow
            style={{
            gap: "40px"
            }}>
                <NavBrand/>

                <FlexRow
                style={{
                gap: "20px"
                }}>
                    <NavButton
                    to="/"
                    caption0="01"
                    caption1="Home"/>

                    <NavButton
                    to="https://dreamcatcher-1.gitbook.io/dreamcatcher"
                    caption0="02"
                    caption1="Whitepaper"/>

                    <NavButton
                    to="/explore"
                    caption0="03"
                    caption1="Explore"/>

                    <NavButton
                    to="/tokenomics"
                    caption0="04"
                    caption1="Tokenomics"/>             
                </FlexRow>
            </FlexRow>

            <FlexRow
            style={{
            gap: "20px"
            }}>
                <NavAccount/>

                <NavConnectButton/>
            </FlexRow>
        </FlexRow>
    </>;
}