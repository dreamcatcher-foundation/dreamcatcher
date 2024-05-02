import React, {type ReactNode} from "react";
import NavbarItem from "../../component/layout/navbar/NavbarItem.tsx";
import NavbarComponent from "../../component/layout/navbar/Navbar.tsx";
import ConnectButton from "./ConnectButton.tsx";
import BrandNameAndLogo from "./BrandNameAndLogo.tsx";

export default function Navbar(): ReactNode {
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
            <BrandNameAndLogo/>

            <NavbarComponent name="navbar">
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
            </NavbarComponent>

            <ConnectButton/>
        </div>
    );
}