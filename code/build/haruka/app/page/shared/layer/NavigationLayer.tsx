import React, {type ReactNode} from "react";
import Layer from "../components/layout/Layer.tsx";
import Navbar from "../components/layout/userInterface/navbar/Navbar.tsx";
import NavbarOption from "../components/layout/userInterface/navbar/NavbarOption.tsx";
import RowHook from "../components/layout/RowHook.tsx";
import BrandNameAndLogo from "../design/brand/BrandNameAndLogo.tsx";
import ConnectButton from "../userInterface/input/button/ConnectButton.tsx";

export default function NavigationLayer(): ReactNode {
    return (
        <Layer
        style={{
            justifyContent: "start",
            paddingTop: "20px",
            pointerEvents: "none"
        }}>
            <RowHook 
            uniqueId="navigationLayer.topRow"
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
                uniqueId="navigationLayer.navbar"
                style={{
                    gap: "20px"
                }}>
                    <NavbarOption
                    text0="01"
                    text1="Home"
                    link="/"/>

                    <NavbarOption
                    text0="02"
                    text1="Whitepaper"
                    link="https://dreamcatcher-1.gitbook.io/dreamcatcher"/>

                    <NavbarOption
                    text0="03"
                    text1="Explore"
                    link="/explore"/>

                    <NavbarOption
                    text0="04"
                    text1="Get Started"
                    link="/getStarted"/>

                    <NavbarOption
                    text0="05"
                    text1="Account"
                    link="/account"/>
                </Navbar>

                <ConnectButton/>
            </RowHook>
        </Layer>
    );
}