import { Grid } from "src/public/component_/layout/grid/Grid";
import { GridItem } from "src/public/component_/layout/grid/GridItem";
import { GridItemCoordinate } from "src/public/component_/layout/grid/GridItemCoordinate";

export function Nav() {
    return <>
        <Grid
        width="100%"
        height="100px"
        rowCount={4n}
        colCount={2n}>
            <GridItem
            coordinate0={GridItemCoordinate({x: 1n, y: 1n})}
            coordinate1={GridItemCoordinate({x: 2n, y: 3n})}
            style={{
                background: "#FFF"
            }}>

            </GridItem>
        </Grid>
    </>;
}




import { Row } from "@component/Row";
import { RelativeUnit } from "@lib/RelativeUnit";
import { NavBrand } from "src/public/component_/nav/NavBrand";
import { NavButton } from "src/public/component_/nav/NavButton";
import { NavConnectButton } from "src/public/component_/nav/NavConnectButton";
import React from "react";

export function Navs(): React.JSX.Element {
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
                label="Explore"
                to="/explore"/>
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