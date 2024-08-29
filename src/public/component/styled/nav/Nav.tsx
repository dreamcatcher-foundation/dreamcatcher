import type { ReactNode } from "react";
import { NavBrand } from "@component/NavBrand";
import { NavButton } from "@component/NavButton";
import { NavConnectButton } from "@component/NavConnectButton";
import { FlexRow } from "@component/FlexRow";

export function Nav(): ReactNode {
    return <>
        <FlexRow
        style={{
            width: "1024px",
            height: "auto",
            justifyContent: "space-between",
            paddingTop: "20px",
            paddingBottom: "10px",
            paddingLeft: "20px",
            paddingRight: "20px"
        }}>
            <NavBrand/>

            <FlexRow
            style={{
                gap: "20px"
            }}>
                <NavButton
                to={ "" }
                caption0="01"
                caption1="Home"/>

                <NavButton
                to={ "" }
                caption0="02"
                caption1="Whitepaper"/>

                <NavButton
                to={ "" }
                caption0="03"
                caption1="Explore"/>
            </FlexRow>

            <NavConnectButton/>
        </FlexRow>
    </>;
}