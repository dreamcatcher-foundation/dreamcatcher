import React, {type ReactNode} from "react";
import NavbarItem from "../layout/navbar/NavbarItem.tsx";
import Navbar from "../layout/navbar/Navbar.tsx";
import Layer from "../layout/Layer.tsx";

export default function NavUserInterfaceLayer(): ReactNode {
    return (
        <Layer name={"navUserInterface"}>
        <Navbar name={"navUserInterfaceNavbar"}>
            <NavbarItem {...{
                textName0: "navUserInterfaceNavbarItem0A",
                textName1: "navUserInterfaceNavbarItem0B",
                text0: "01",
                text1: "Whitepaper",
                link: "https://dreamcatcher-1.gitbook.io/dreamcatcher"
            }}>
            </NavbarItem>
            <NavbarItem {...{
                textName0: "navUserInterfaceNavbarItem1A",
                textName1: "navUserInterfaceNavbarItem1B",
                text0: "02",
                text1: "Explore",
                link: ""
            }}>
            </NavbarItem>
            <NavbarItem {...{
                textName0: "navUserInterfaceNavbarItem2A",
                textName1: "navUserInterfaceNavbarItem2B",
                text0: "03",
                text1: "Get Started",
                link: ""
            }}>
            </NavbarItem>
        </Navbar>
    </Layer>
    );
}