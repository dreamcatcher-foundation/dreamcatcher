import React, {type ReactNode} from "react";
import NavbarItem from "../layout/navbar/NavbarItem.tsx";
import Navbar from "../layout/navbar/Navbar.tsx";
import Layer from "../layout/Layer.tsx";
import ConnectButton from "../button/ConnectButton.tsx";
import Row from "../layout/Row.tsx";
import Col from "../layout/Col.tsx";
import Text from "../text/Text.tsx";

export default function NavUserInterfaceLayer(): ReactNode {
    return (
        <Layer {...{
            name: "navUserInterface",
            style: {
                justifyContent: "start",
                paddingTop: "20px"
            }
        }}>
            <Row {...{
                name: "navUserInterfaceTopRow",
                style: {
                    width: "100%", 
                    height: "auto",
                    justifyContent: "space-between",
                    paddingLeft: "40px",
                    paddingRight: "40px"
                }
            }}>
                <Col {...{
                    name: "navUserInterfaceBrand",
                    style: {
                        width: "170px",
                        height: "60px",
                        borderStyle: "solid",
                        borderWidth: "1px",
                        borderImage: "linear-gradient(to bottom, transparent, #505050) 1"
                    }
                }}>
                    <div {...{
                        style: {
                            width: "25px",
                            height: "25px",
                            backgroundImage: "url('../../image/SteelLogo.png')",
                            backgroundSize: "contain",
                            position: "relative",
                            bottom: "12.5px"
                        }
                    }}>
                    </div>
                    <Text {...{
                        name: "navUserInterfaceBrandName",
                        text: "Dreamcatcher",
                        style: {
                            fontSize: "20px",
                            position: "relative",
                            bottom: "12.5px"
                        }
                    }}>
                    </Text>
                </Col>
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
                <ConnectButton/>
            </Row>
        </Layer>
    );
}