import type {CSSProperties} from "react";
import {Page, Slide, Row, Col} from "../component/Structure.tsx";
import {Link} from "react-router-dom";
import {Remote} from "../component/Remote.tsx";
import {network, broadcast} from "../network/Network.ts";
import {BrowserProvider, Contract, JsonRpcSigner, Network} from "ethers";

interface ISteelTextProps {
    text: string;
    style: CSSProperties;
}

function SteelText(p: ISteelTextProps) {
    p.style = p.style ?? {};
    const style = {
        fontSize: "8px",
        fontFamily: "roboto mono",
        fontWeight: "bold",
        color: "white",
        background: "-webkit-linear-gradient(#FFFFFF, #A4A2A1)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    };
    return (
        <div style={{...style, ...p.style}}>
            {p.text}
        </div>
    );
}

interface IMenuOptionProps {
    to: string;
    number: string;
    text: string;
}

function MenuOption(p: IMenuOptionProps) {
    return (
        <Link to={p.to} style={{textDecoration: "none", display: "flex", flexDirection: "row", gap: "5px"}}>
            <SteelText text={p.number} style={{background: "#615FFF", fontSize: "15px"}}/>
            <SteelText text={p.text} style={{fontSize: "15px"}}/>
        </Link>
    );
}

function Menu() {
    return (
        <Row w={"40%"} h={"100%"} style={{gap: "15px"}}>
            <MenuOption to={"/"} number={"01"} text={"Home"}/>
            <MenuOption to={"/"} number={"02"} text={"Protocol"}/>
            <MenuOption to={"/"} number={"03"} text={"Governance"}/>
            <MenuOption to={"/"} number={"04"} text={"Get Started"}/>  
        </Row>
    );
}

function ConnectButton() {
    //const [connecting, _connecting] = useState(false);

    function onmouseenter() {
        broadcast(network(), "connect-button::render::spring", {cursor: "pointer"});
    }

    async function onclick() {
        const provider = new BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
    }
    return (
        <Row w={"30%"} h={"100%"}>
            <Remote name={"connect-button"} network={network()}>
                <div onMouseEnter={onmouseenter} onClick={onclick}>
                    <SteelText text={"Connect"} style={{fontSize: "20px"}}/>
                </div>
            </Remote>
        </Row>
    );
}

export default function HomePage() {
    return (
        <Page>
            <Slide layer={"1000"}></Slide>
            <Slide layer={"2000"}>
                <Row w={"100%"} h={"10%"} style={{justifyContent: "space-between"}}>
                    <Row w={"30%"} h={"100%"}></Row>
                    <Menu/>

                </Row>
            </Slide>
        </Page>
    );
}