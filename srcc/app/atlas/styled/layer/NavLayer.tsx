import { type ReactNode } from "react";
import { Layer } from "@atlas/component/layout/Layer.tsx";
import { Navbar } from "@atlas/component/layout/user-interface/navbar/Navbar.tsx";
import { NavbarItem } from "@atlas/component/layout/user-interface/navbar/NavbarItem.tsx";
import { RowHook } from "@atlas/component/layout/RowHook.tsx";
import { BrandNameAndLogo } from "@atlas/styled/decoration/BrandNameAndLogo.tsx";
import React from "react";

function NavLayer(): ReactNode {
    return (
        <Layer
        style={{
            justifyContent: "start",
            paddingTop: "20px",
            pointerEvents: "none"
        }}>
            <RowHook
            node="navLayer.topRow"
            style={{
                width: "100%",
                height: "auto",
                justifyContent: "space-between",
                paddingLeft: "40px",
                paddingRight: "40px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                pointerEvents: "auto"
            }}>
                <BrandNameAndLogo/>

                <Navbar
                node="navLayer.navbar"
                style={{
                    gap: "20px"
                }}>
                    <NavbarItem
                    text0="01"
                    text1="Home"
                    link="/">
                    </NavbarItem>

                    <NavbarItem
                    text0="02"
                    text1="Whitepaper"
                    link="https://dreamcatcher-1.gitbook.io/dreamcatcher">
                    </NavbarItem>

                    <NavbarItem
                    text0="03"
                    text1="Explore"
                    link="/explore">
                    </NavbarItem>

                    <NavbarItem
                    text0="04"
                    text1="Get Started"
                    link="/getStarted">
                    </NavbarItem>

                    <NavbarItem
                    text0="05"
                    text1="Account"
                    link="/account">
                    </NavbarItem>
                </Navbar>
            </RowHook>
        </Layer>
    );
}

export { NavLayer };