import { Row } from "@component/Row";
import { RelativeUnit } from "@lib/RelativeUnit";
import { NavBrand } from "@component/NavBrand";
import { NavButton } from "@component/NavButton";
import { NavConnectButton } from "@component/NavConnectButton";
import React from "react";

export function Nav(): React.JSX.Element {
    return <>
        <Row
        style={{
            width: RelativeUnit(100),
            justifyContent: "space-between",
            padding: RelativeUnit(2)
        }}>
            <NavBrand/>
            <Row
            style={{
                gap: RelativeUnit(2)
            }}>
                <NavButton
                label="Home"
                to="/"/>
                <NavButton
                label="Whitepaper"
                to="https://dreamcatcher-1.gitbook.io/dreamcatcher"/>
                <NavButton
                label="Launch"
                to="/launch"/>
                <NavButton
                label="Github"
                to="/"/>
            </Row>
            <NavConnectButton/>
        </Row>
    </>;
}