import {Page} from "../component/Page.tsx";
import {Slide} from "../component/Slide.tsx";
import {Background} from "../component/Background.tsx";
import {RemoteButton} from "../component/RemoteButton.tsx";
import {network} from "../connection/Network.tsx";
import {Row} from "../component/Row.tsx";
import {Col} from "../component/Col.tsx";
import {SteelFrame} from "../component/SteelFrame.tsx";
import {SteelText} from "../component/SteelText.tsx";
import {Remote} from "../component/Remote.tsx";
import {broadcast} from "../connection/Connection.tsx";
import {Link} from "react-router-dom";
import {useState} from "react";

import {BrowserProvider, Contract, JsonRpcSigner, Network} from "ethers";

export class gate {
    private static _provider: BrowserProvider;
    private static _signer: JsonRpcSigner;
    private static _network: Network;

    private constructor() {}

    public static get provider() {
        return gate._provider;
    }

    public static get signer() {
        return gate._signer;
    }

    public static get network() {
        return gate._network;
    }

    public static async connect() {
        gate._provider = new BrowserProvider(gate._METAMASK);
        gate._signer = await gate._provider.getSigner();
        gate._network = await gate._provider.getNetwork();
    }

    private static get _METAMASK() {
        return (window as any).ethereum;
    }
}

function GetStartedButton() {
    return (
        <Remote
        name={"getStartedButton"}
        network={network()}
        initSpring={({
            width: "200px",
            height: "50px",
            color: "#000",
            background: "#615FFF"
        } as any)}
        initStylesheet={{
            fontFamily: "roboto mono",
            fontSize: "12px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Link
            to={"/get-started"}
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit"
            }}
            onMouseEnter={function() {
                broadcast(network(), "getStartedButton::render::spring", {
                    background: "#7774FF",
                    cursor: "pointer"
                });
            }}
            onMouseLeave={function() {
                broadcast(network(), "getStartedButton::render::spring", {
                    background: "#615FFF",
                    cursor: "auto"
                });
            }}>
            Get Started
            </Link>
        </Remote>
    );
}

function LearnMoreButton() {
    return (
        <Remote
        name={"learnMoreButton"}
        network={network()}
        initSpring={({
            width: "200px",
            height: "50px",
            color: "#615FFF",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "#615FFF"
        } as any)}
        initStylesheet={{
            fontFamily: "roboto mono",
            fontSize: "12px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Link
            to={"https://dreamcatcher-1.gitbook.io/dreamcatcher"}
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit"
            }}
            onMouseEnter={function() {
                broadcast(network(), "learnMoreButton::render::spring", {
                    borderColor: "#7774FF",
                    cursor: "pointer",
                    color: "#7774FF"
                });
            }}
            onMouseLeave={function() {
                broadcast(network(), "learnMoreButton::render::spring", {
                    borderColor: "#615FFF",
                    cursor: "auto",
                    color: "#615FFF"
                });
            }}>
            Learn More
            </Link>
        </Remote>
    );
}

function Window() {
    return (
        <SteelFrame
        width={"500px"}
        height={"512px"}
        gradientDirection={"to top"}>
            <Col
            width={"450px"}
            height={"442px"}
            stylesheet={{
                borderWidth: "1px",
                borderStyle: "solid",
                borderImage: "linear-gradient(to bottom, transparent, #474647) 1",
                background: "#171718",
                padding: "40px"
            }}>
                <Col
                width={"100%"}
                height={"auto"}>
                    <SteelText
                    text={"Scaling Dreams, Crafting Possibilities"}
                    stylesheet={{
                        background: "#615FFF",
                        fontSize: "40px"
                    }}/>
                    <SteelText
                    text={"Deploy and manage ERC2535 diamonds"}
                    stylesheet={{
                        fontSize: "16px",
                        paddingTop: "10px"
                    }}/>
                </Col>
                <Row
                width={"100%"}
                height={"auto"}
                stylesheet={{
                    gap: "20px",
                    paddingTop: "120px"
                }}>
                    <GetStartedButton/>
                    <LearnMoreButton/>
                </Row>
            </Col>
        </SteelFrame>
    );
}

function Trademark() {
    return (
        <Col
        width={"100%"}
        height={"auto"}
        stylesheet={{
            gap: "5px",
            paddingBottom: "30px"
        }}>
            <Row
            width={"100%"}
            height={"auto"}
            stylesheet={{
                gap: "5px"
            }}>
                <Link
                to={""}
                style={{
                    textDecoration: "none",
                    fontSize: "5px",
                    color: "white",
                }}>
                    <SteelText
                    text={"Telegram"}/>
                </Link>
                <SteelText
                text={"|"}/>
                <Link
                to={""}
                style={{
                    textDecoration: "none",
                    fontSize: "5px",
                    color: "white",
                }}>
                    <SteelText
                    text={"Discord"}/>
                </Link>
                <SteelText
                text={"|"}/>
                <Link
                to={""}
                style={{
                    textDecoration: "none",
                    fontSize: "5px",
                    color: "white",
                }}>
                    <SteelText
                    text={"X"}/>
                </Link>
            </Row>
            <SteelText 
            text={"Dreamcatcher © 2024 Privacy Policy"}
            stylesheet={{
                fontSize: "10px"
            }}/>
        </Col>
    );
}

function MenuOption({
    to,
    number,
    text
}: {
    to: string;
    number: string;
    text: string;
}) {
    return (
        <Link
        to={to}
        style={{
            textDecoration: "none",
            display: "flex",
            flexDirection: "row",
            gap: "5px"
        }}>
            <SteelText
            text={number}
            stylesheet={{
                background: "#615FFF",
                fontSize: "15px"
            }}/>
            <SteelText
            text={text}
            stylesheet={{
                fontSize: "15px"
            }}/>
        </Link>
    );
}

function Menu() {
    return (
        <Row
        width={"40%"}
        height={"100%"}
        stylesheet={{
            gap: "15px"
        }}>
            <MenuOption
            to={""}
            number={"01"}
            text={"Home"}/>
            <MenuOption
            to={""}
            number={"02"}
            text={"Protocol"}/>
            <MenuOption
            to={""}
            number={"03"}
            text={"Governance"}/>
            <MenuOption
            to={""}
            number={"04"}
            text={"Get Started"}/>
        </Row>
    );
}

function ConnectButton() {

    return (
        <Row
        width={"30%"}
        height={"100%"}>
            <Remote
            name={"connectButton"}
            network={network()}>
                <div
                onMouseEnter={function() {
                    broadcast(network(), "connectButton::render::spring", {
                        cursor: "pointer"
                    });
                }}
                onClick={function() {

                    gate.connect();
                    
                }}>
                    <SteelText
                    text={"Connect"}
                    stylesheet={{
                        fontSize: "20px"
                    }}/>
                </div>
            </Remote>
        </Row>
    );
}

export function HomePage() {


    return (
        <Page>
            <Background></Background>
            <Slide zIndex={"2000"}>
                <Row 
                width={"100%"} 
                height={"10%"}
                stylesheet={{
                    justifyContent: "space-between"
                }}>
                    <Row
                    width={"30%"}
                    height={"100%"}>

                    </Row>
                    <Menu/>
                    <ConnectButton/>
                </Row>
                <Row width={"100%"} height={"7.6%"}></Row>
                <Row width={"100%"} height={"82.5%"} stylesheet={{justifyContent: "space-between"}}>
                    <Col width={"30%"} height={"100%"}></Col>
                    <Col 
                    width={"40%"} 
                    height={"100%"}
                    stylesheet={{
                        justifyContent: "space-between"
                    }}>
                        <Window/>
                        <Trademark/>
                    </Col>
                    <Col width={"30%"} height={"100%"}></Col>
                </Row>
            </Slide>
        </Page>
    );
}