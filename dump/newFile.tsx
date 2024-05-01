import React from "react";
import Boilerplate from "../code/module/velvet-v3.0.0/react/Boilerplate.tsx";
import Page from "../../../module/velvet-v3.0.0/react/component/base/Page.tsx";
import Layer from "../../../module/velvet-v3.0.0/react/component/base/Layer.tsx";
import Pulse0 from "../code/module/velvet-v3.0.0/react/component/effect/Pulse0.tsx";
import Pulse1 from "../code/module/velvet-v3.0.0/react/component/effect/Pulse1.tsx";
import BlurDot0 from "../code/module/velvet-v3.0.0/react/component/effect/BlurDot0.tsx";
import BlurDot1 from "../code/module/velvet-v3.0.0/react/component/effect/BlurDot1.tsx";
import NavbarItem from "../code/module/velvet-v3.0.0/react/component/navbar/NavbarItem.tsx";
import Navbar from "../code/module/velvet-v3.0.0/react/component/navbar/Navbar.tsx";
import Row from "../../../module/velvet-v3.0.0/react/component/base/Row.tsx";
import Col from "../../../module/velvet-v3.0.0/react/component/base/Col.tsx";
import RemoteText from "../../../module/velvet-v3.0.0/react/component/remote/RemoteText.tsx";
import ConnectButton from "../code/module/velvet-v3.0.0/react/component/button/ConnectButton.tsx";
import Button0 from "../../../module/velvet-v3.0.0/react/component/button/Button0.tsx";
import Button1 from "../../../module/velvet-v3.0.0/react/component/button/Button1.tsx";
import { Link } from "react-router-dom";
import RetroMinimaTaggedMiniContainer from "../code/module/velvet-v3.0.0/react/component/retro-minima/RetroMinimaTaggedMiniContainer.tsx";
import { protocolBrandName } from "../code/build/Ikigai/app/route/home/Index.tsx";

Boilerplate.render([{
    "path": "/",
    "element": <Page {...{
        "children": [
            <Layer {...{
                "children": [
                    <Pulse0 />,
                    <Pulse1 />,
                    <BlurDot0 />,
                    <BlurDot1 />
                ]
            }} />,
            <Layer {...{
                "style": {
                    "justifyContent": "space-between",
                    "paddingTop": "2.5%",
                    "paddingBottom": "2.5%"
                },
                "children": [
                    <Row {...{
                        "style": {
                            "width": "100%",
                            "height": "auto",
                            "justifyContent": "space-between",
                            "paddingLeft": "5%",
                            "paddingRight": "5%"
                        },
                        "children": [
                            <Col {...{
                                "style": {
                                    "width": "165px",
                                    "height": "45px",
                                    "borderWidth": "1px",
                                    "borderStyle": "solid",
                                    "borderImage": "linear-gradient(to bottom, transparent, #505050) 1"
                                },
                                "className": "swing-in-top-fwd",
                                "children": [
                                    <Col {...{
                                        "style": {
                                            "backgroundImage": "url('./image/SteelLogo.png')",
                                            "backgroundSize": "contain",
                                            "backgroundRepeat": "no-repeat",
                                            "backgroundPosition": "center",
                                            "width": "25px",
                                            "height": "25px",
                                            "position": "relative",
                                            "bottom": "10px"
                                        }
                                    }} />,
                                    <RemoteText {...{
                                        "address": "BrandAndLogoText",
                                        "initialText": protocolBrandName,
                                        "initialStyle": {
                                            "fontSize": "20px",
                                            "position": "relative",
                                            "bottom": "10px"
                                        }
                                    }} />
                                ]
                            }} />,
                            <Navbar {...{
                                "address": "Navbar",
                                "children": [
                                    <NavbarItem {...{
                                        "address": "NavbarItem0",
                                        "text0": "01",
                                        "text1": "Whitepaper",
                                        "link": "https://dreamcatcher-1.gitbook.io/dreamcatcher"
                                    }} />,
                                    <NavbarItem {...{
                                        "address": "NavbarItem1",
                                        "text0": "02",
                                        "text1": "Get Started",
                                        "link": "/"
                                    }} />
                                ]
                            }} />,
                            <ConnectButton />
                        ]
                    }} />,
                    <Row {...{
                        "style": {
                            "width": "100%",
                            "height": "auto",
                            "paddingLeft": "5%",
                            "paddingRight": "5%"
                        },
                        "children": [
                            <Col {...{
                                "style": {
                                    "width": "450px",
                                    "height": "450px",
                                    "background": "#171717",
                                    "borderWidth": "1px",
                                    "borderStyle": "solid",
                                    "borderImage": "linear-gradient(to bottom, transparent, #505050) 1",
                                    "padding": "2.5%",
                                    "justifyContent": "space-between",
                                    "overflowX": "hidden",
                                    "overflowY": "auto"
                                },
                                "className": "swing-in-top-fwd",
                                "children": [
                                    <RemoteText {...{
                                        "address": "Heading",
                                        "initialText": "Scaling Dreams, Crafting Possibilities.",
                                        "initialStyle": {
                                            "fontSize": "40px",
                                            "background": "#615FFF"
                                        }
                                    }} />,
                                    <RemoteText {...{
                                        "address": "SubHeading",
                                        "initialText": "Deploy tokenized vaults in seconds",
                                        "initialStyle": {
                                            "fontSize": "20px"
                                        }
                                    }} />,
                                    <Row {...{
                                        "style": {
                                            "width": "100%",
                                            "height": "1px",
                                            "background": "linear-gradient(to right, transparent, #505050, transparent)",
                                            "marginTop": "5%",
                                            "marginBottom": "5%",
                                            "opacity": "0.25"
                                        }
                                    }} />,
                                    <Row {...{
                                        "style": {
                                            "gap": "5%"
                                        },
                                        "children": [
                                            <Link {...{
                                                "to": "/get-started",
                                                "style": {
                                                    "textDecoration": "none"
                                                },
                                                "children": [
                                                    <Button0 {...{
                                                        "address": "GetStartedButton",
                                                        "text": "Get Started"
                                                    }} />
                                                ]
                                            }} />,
                                            <Link {...{
                                                "to": "https://dreamcatcher-1.gitbook.io/dreamcatcher",
                                                "style": {
                                                    "textDecoration": "none"
                                                },
                                                "children": [
                                                    <Button1 {...{
                                                        "address": "LearnMoreButton",
                                                        "text": "Learn More"
                                                    }} />
                                                ]
                                            }} />
                                        ]
                                    }} />
                                ]
                            }} />
                        ]
                    }} />,
                    <Row {...{
                        "style": {
                            "width": "100%",
                            "height": "auto",
                            "paddingLeft": "5%",
                            "paddingRight": "5%"
                        },
                        "children": [
                            <Col {...{
                                "style": {
                                    "fontSize": "5px"
                                },
                                "children": [
                                    <RemoteText {...{
                                        "address": "Trademark",
                                        "initialText": `${protocolBrandName} © 2024 Privacy Policy`,
                                        "initialStyle": {
                                            "fontSize": "10px"
                                        }
                                    }} />
                                ]
                            }} />
                        ]
                    }} />
                ]
            }} />
        ]
    }} />
}, {
    "path": "/get-started",
    "element": <Page {...{
        "children": [
            <Layer {...{
                "children": []
            }} />,
            <Layer {...{
                "children": [
                    <Col {...{
                        "style": {
                            "width": "900px",
                            "height": "450px",
                            "background": "#171717",
                            "borderWidth": "1px",
                            "borderStyle": "solid",
                            "borderColor": "#505050",
                            "padding": "2.5%",
                            "justifyContent": "space-between",
                            "overflowX": "hidden",
                            "overflowY": "auto"
                        },
                        "children": [
                            <Row {...{
                                "style": {
                                    "width": "100%",
                                    "height": "100%",
                                    "justifyContent": "space-between",
                                    "alignItems": "start"
                                },
                                "children": [
                                    <Col {...{
                                        "style": {
                                            "width": "auto",
                                            "height": "100%",
                                            "justifyContent": "space-between"
                                        },
                                        "children": [
                                            <RetroMinimaTaggedMiniContainer {...{
                                                "text": "Settings",
                                                "style": {
                                                    "width": "300px",
                                                    "height": "100px"
                                                }
                                            }} />,
                                            <Row {...{
                                                "style": {
                                                    "gap": "5%"
                                                },
                                                "children": [
                                                    <Button0 {...{
                                                        "address": "DeployButton",
                                                        "text": "Deploy"
                                                    }} />,
                                                    <Link {...{
                                                        "to": "/",
                                                        "style": {
                                                            "textDecoration": "none"
                                                        },
                                                        "children": [
                                                            <Button1 {...{
                                                                "address": "BackHomeButton",
                                                                "text": "I'm Not Ready Yet"
                                                            }} />
                                                        ]
                                                    }} />
                                                ]
                                            }} />
                                        ]
                                    }} />,
                                    <RetroMinimaTaggedMiniContainer {...{
                                        "text": "Extensions",
                                        "style": {
                                            "width": "300px",
                                            "height": "100%"
                                        }
                                    }} />
                                ]
                            }} />
                        ]
                    }} />
                ]
            }} />
        ]
    }} />
}]);
