import React, {useEffect} from "react";
import Remote, {broadcast, on, off, once} from "./design/Remote.tsx";
import Background from "./design/Background.tsx";
import Layer from "./design/Layer.tsx";
import RemoteCol from "./design/RemoteCol.tsx";
import RemoteRow from "./design/RemoteRow.tsx";
import PurpleTextHeading from "./design/PurpleTextHeading.tsx";
import Window from "./design/Window.tsx";
import SteelTextSubHeading from "./design/SteelTextSubHeading.tsx";
import RemoteButton1 from "./design/RemoteButton1.tsx";
import RemoteButton2 from "./design/RemoteButton2.tsx";
import Row from "./design/Row.tsx";
import Col from "./design/Col.tsx";
import SteelTextParagraph from "./design/SteelTextParagraph.tsx";

enum WindowState {
    NONE,
    IDLE,
    SETTINGS,
    INSTALLATION,
    DEPLOYING,
    YOU_ARE_ALL_SET_TO_GO
}





const introAnimation = "swing-in-top-fwd";
const outroAnimation = "swing-out-top-bck";

function saveToLocalStorage(k: string, v: string) {
    return localStorage.setItem(k, v);
}

function loadFromLocalStorage(k: string) {
    return localStorage.getItem(k);
}

async function execute(name: string, fns: Function[], cooldown: bigint) {
    const fnLength = fns.length;
    let wait = 0n;
    for (let i = 0; i < fnLength; i++) {
        const fn = fns[i];
        await new Promise(resolve => {
            setTimeout(function() {
                fn();
                resolve(null);
            }, Number(wait));
        });
        wait += cooldown;
    }
    await new Promise(resolve => {
        setTimeout(function() {
            broadcast(`${name} transition done`);
            resolve(null);
        }, Number(wait));
    });
}

function push(name: string, component: JSX.Element) {
    broadcast(`${name} pushBelow`, component);
}

function outro(name: string) {
    broadcast(`${name} setClassName`, outroAnimation);
}

function wipe(name: string) {
    broadcast(`${name} wipe`);
}








const window = (function() {
    let instance: {
        goto: typeof goto;
    };
    let _state: WindowState = WindowState.NONE;

    function Header(text: {text: string}) {
        return (
            <Remote name={"header"} initialClassName={introAnimation}>
                <PurpleTextHeading text={"Scaling Dreams, Crafting Possibilities"} style={{}}/>
            </Remote>
        );
    }

    function includeButtonsSection() {
        push(
            "window",
            <RemoteRow name={"buttonsSection"} width={"100%"} height={"auto"} initStyle={{gap: "20px"}}/>
        );
    }

    function state() {
        return _state;
    }

    async function goto(to: WindowState) {
        switch (to) {
            case WindowState.IDLE:
                _onDone(_toIdle);
                break;
            case WindowState.SETTINGS:
                _onDone(toSettings);
                break;
            default:
                _onDone(_toIdle);
                break;
        }
        switch (state()) {
            case WindowState.NONE:
                _done();
                break;
            case WindowState.IDLE:
                _fromIdle();
                break;
            case WindowState.SETTINGS:
                _fromSettings();
                break;
            default:
                _done();
                break;
        }
        _state = to;
        console.log(state());
    }

    async function _toIdle() {
        function Header() {
            return (
                <Remote name={"header"} initialClassName={introAnimation}>
                    <PurpleTextHeading text={"Scaling Dreams, Crafting Possibilities"} style={{}}/>
                </Remote>
            );
        }

        function SubHeader() {
            const subHeadings = [
                "You won't need accountants where we are going",
                "Do your client's trust you? They shouldn't have to",
                "Finance is broken, help us fix it",
                "68% of fund managers hate paying expensive operation costs",
                "Web3 is much more than meme coins and monkey pics ... or is it?",
                "Please leave us feedback : ) it helps us a lot",
                "You look familiar, have we seen you here before?",
                "It's time to empower the little guy",
                "Access global liquidity in seconds",
                "Rug proof",
                "Our community drives us",
                "Hate VC? We do too, that's why we are 100% public",
                "How can you trust your money is safe? Open-source!",
                "Let us, help you, change the world.",
                "Entepreneurs wanted!"
            ];
            const subHeadingsLength = subHeadings.length;
            const randomSubHeadingIndex = Math.floor(Math.random() * subHeadingsLength);
            const randomSubHeading = subHeadings[randomSubHeadingIndex];
            return (
                <Remote name={"subHeader"} initialClassName={introAnimation} initStyle={{marginTop: "10px"}}>
                    <SteelTextSubHeading text={randomSubHeading} style={{fontSize: "15px"}}/>
                </Remote>
            );
        }
        
        execute("window", [
            () => push("window", <Header/>),
            () => push("window", <SubHeader/>),
            () => push("window", <Row width={"100%"} height={"150px"}/>),
            () => push("window", <RemoteRow name={"buttonsSection"} width={"100%"} height={"auto"} initStyle={{gap: "20px"}}/>),
            () => push("buttonsSection", <RemoteButton1 name={"getStartedButton"} text={"Get Started"} initialClassName={introAnimation}/>),
            () => push("buttonsSection", <RemoteButton2 name={"learnMoreButton"} text={"Learn More"} initialClassName={introAnimation}/>),
            () => on("getStartedButton clicked", () => window().goto(WindowState.SETTINGS)),
            () => on("learnMoreButton clicked", () => (window as any)?.open("https://dreamcatcher-1.gitbook.io/dreamcatcher/"))
        ], 25n);
    }

    async function _fromIdle() {
        execute("window", [
            () => off("getStartedButton clicked"),
            () => off("learnMoreButton clicked"),
            () => outro("header"),
            () => outro("subHeader"),
            () => outro("getStartedButton"),
            () => outro("learnMoreButton"),
            () => wipe("window")
        ], 25n);
    }

    type TComponent = JSX.Element | (JSX.Element)[];

    function Settings() {
        function Wrapper({children}: {children?: TComponent}) {
            const wrapperWidth = "100%";
            const wrapperHeight = "100%";
            return <Col width={wrapperWidth} height={wrapperHeight}>{children}</Col>
        }
        function HeadingContainer({children}: {children?: TComponent}) {
            const remoteName = "headerContainer";
            return <Remote name={remoteName}>{children}</Remote>
        }
        function Heading({children}: {children?: TComponent}) {
            const text = "Settings";
            const style = {};
            return <PurpleTextHeading text={text} style={style}/>
        }
        function SubHeadingContainer({children}: {children?: TComponentt}) {
            
        }
        const remoteName = "header";
        const headerText = "Settings";
        const purpleTextHeadingStyle = {};
        return (
            <Wrapper>
                <HeadingContainer><Heading/></HeadingContainer>
            </Wrapper>
        );
    }

    async function toSettings() {
        function inputContainerStyle() {
            return {
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "start"
            };
        }

        function inputStyle() {
            return {
                outline: "none",
                background: "transparent"
            };
        }

        function includeHeader() {
            push(
                "window", 
                <Remote name={"header"} initialClassName={introAnimation}>
                    <PurpleTextHeading text={"Settings"} style={{}}/>
                </Remote>
            );
        }

        function includeTokenNameInput() {
            push(
                "window",
                <Remote name={"tokenNameInput"} initialClassName={introAnimation} initStyle={inputContainerStyle() as any}>
                    <Row width={"100%"} height={"auto"}>
                        <SteelTextParagraph text={"Token Name: "} style={{}}/>
                        <input style={inputStyle()}/>
                    </Row>
                </Remote>
            );
        }

        function includeTokenSymbolInput() {
            push(
                "window",
                <input/>
            );
        }

        function includeGap() {
            push(
                "window",
                <Row width={"100%"} height={"150px"}/>
            );
        }

        function includeOkButton() {
            push(
                "buttonsSection",
                <RemoteButton1 name={"okButton"} text={"Ok"} initialClassName={introAnimation}/>
            );
        }

        function includeImNotReadyYetButton() {
            push(
                "buttonsSection",
                <RemoteButton2 name={"imNotReadyYetButton"} text={"I'm Not Ready Yet"} initialClassName={introAnimation}/>
            );
        }

        function handleImNotReadyYetButton() {
            on("imNotReadyYetButton clicked", () => window().goto(WindowState.IDLE));
        }
    
        execute("window", [
            includeHeader,
            includeTokenNameInput,
            includeTokenSymbolInput,
            includeGap,
            includeButtonsSection,
            includeOkButton,
            includeImNotReadyYetButton,
            handleImNotReadyYetButton
        ], 25n);
    }

    async function _fromSettings() {
        function pauseButtonClickEvents() {
            off("backButton clicked");
        }

        function outroHeader() {
            broadcast("header setClassName", outroAnimation);
        }

        function outroOkButton() {
            broadcast("okButton setClassName", outroAnimation);
        }

        function outroBackButton() {
            broadcast("backButton setClassName", outroAnimation);
        }

        function wipe() {
            broadcast("window wipe");
        }

        execute("window", [
            pauseButtonClickEvents,
            outroHeader,
            outroOkButton,
            outroBackButton,
            wipe
        ], 25n);
    }

    async function _done() {
        broadcast("window transition done");
    }

    async function _onDone(fn: Function) {
        once("window transition done", fn);
    }

    function _pushToWindow(component: JSX.Element) {
        broadcast("window pushBelow", component);
    }

    function _intro(name: string) {
        broadcast(`${name} setClassName`, introAnimation);
    }

    function _outro(name: string) {
        broadcast(`${name} setClassName`, outroAnimation);
    }

    function _push(name: string, component: JSX.Element) {
        broadcast(`${name} pushBelow`, component);
    }

    function _onClickOf(name: string, fn: Function) {
        on(`${name} clicked`, fn);
    }

    return function() {
        if (!instance) {
            instance = {
                goto
            };
        }
        return instance;
    }
})();







const page = (function() {
    let instance: {};

    return function() {
        if (!instance) {
            return instance = {};
        }
        return instance;
    }
})();








export const operator = (function() {
    let instance: any;
    let _delay = 50;








    _enterHomePageSubProcess();

    function _enterHomePageSubProcess() {

        _exec(function() {
            broadcast("page pushBelow", <Background/>);
            broadcast("page pushBelow", 
                <Layer zIndex={"2000"}>
                    <RemoteCol name={"layer"} width={"100%"} height={"100%"}/>
                </Layer>
            );
        });
    
        _exec(function() {
            broadcast("layer pushBelow", 
                <Window name={"window"} width={"450px"} height={"450px"}/>
            );
        });

        _exec(() => window().goto(WindowState.IDLE));
    }

    function _exec(fn: Function) {
        setTimeout(fn, _delay);
        _delay += 20;
    }



    return function() {
        if (!instance) {
            instance = {}
        }
        return instance;
    }
})();

