import React, {type ReactNode} from "react";
import NavbarItem from "../layout/navbar/NavbarItem.tsx";
import Navbar from "../layout/navbar/Navbar.tsx";
import ConnectButton from "./button/ConnectButton.tsx";
import BrandNameAndLogo170x60 from "./brand/BrandNameAndLogo170x60.tsx";

export default function Nav(): ReactNode {
    return (
        <div
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
            <BrandNameAndLogo170x60/>

            <Navbar name="navbar">
                <NavbarItem
                textName0="navbarItem0A"
                textName1="navbarItem0B"
                text0="01"
                text1="Home"
                link="/"/>

                <NavbarItem
                textName0="navbarItem1A"
                textName1="navbarItem1B"
                text0="02"
                text1="Whitepaper"
                link="https://dreamcatcher-1.gitbook.io/dreamcatcher"/>

                <NavbarItem
                textName0="navbarItem2A"
                textName1="navbarItem2B"
                text0="03"
                text1="Explore"
                link="/explore"/>

                <NavbarItem
                textName0="navbarItem3A"
                textName1="navbarItem3B"
                text0="04"
                text1="Get Started"
                link="/getStarted"/>

                <NavbarItem
                textName0="navbarItem4A"
                textName1="navbarItem4B"
                text0="05"
                text1="Account"
                link="/account"/>
            </Navbar>

            <ConnectButton/>
        </div>
    );
}