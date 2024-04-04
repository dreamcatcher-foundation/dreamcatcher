import Remote, {broadcast, on, once, off} from "./design/Remote.tsx";
import RemoteRow from "./design/RemoteRow.tsx";
import RemoteButton1 from "./design/RemoteButton1.tsx";
import RemoteButton2 from "./design/RemoteButton2.tsx";
import Row from "./design/Row.tsx";
import PurpleTextHeading from "./design/PurpleTextHeading.tsx";
import SteelTextSubHeading from "./design/SteelTextSubHeading.tsx";
import StateConstructor from "./StateConstructor.tsx";
import StateMachineConstructor from "./StateMachineConstructor.ts";
import {introAnimation, outroAnimation} from "./Animations.tsx";
import React from "react";

const State = {
    Idle: "idle",
    Deployment: "1",
    Deploying: "2",
    installation: "3",
    takeMeThere: "4"
};

const idle = StateConstructor();
idle.setParent("window")
idle.setCooldown(100n)
idle.setTo([
    function() {
        broadcast("window pushBelow",
            <Remote name={"header"} initialClassName={introAnimation()}>
                <PurpleTextHeading text={"Scaling Dreams, Crafting Possibilities"} style={{}}/>
            </Remote>
        );
    },
    function() {
        function randomSubHeading() {
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
            return randomSubHeading;
        }

        broadcast("window pushBelow",
            <Remote name={"subHeader"} initialClassName={introAnimation()} initStyle={{marginTop: "10px"}}>
                <SteelTextSubHeading text={randomSubHeading()} style={{fontSize: "15px"}}/>
            </Remote>
        );
    },
    function() {
        broadcast("window pushBelow", 
            <Row width={"100%"} height={"150px"}/>
        );
    },
    function() {
        broadcast("window pushBelow",
            <RemoteRow name={"buttonsSection"} width={"100%"} height={"auto"} initStyle={{gap: "20px"}}/>
        );
    },
    function() {
        broadcast("buttonsSection pushBelow", 
            <RemoteButton1 name={"getStartedButton"} text={"Get Started"} initialClassName={introAnimation()}/>
        );
    },
    function() {
        broadcast("buttonsSection pushBelow", 
            <RemoteButton2 name={"learnMoreButton"} text={"Learn More"} initialClassName={introAnimation()}/>
        );
    },
    function() {
        on("getStartedButton clicked", function() {
            window.goto("deployment");
        });
        on("learnMoreButton clicked", function() {
            const url = "https://dreamcatcher-1.gitbook.io/dreamcatcher/";
            (window as any)?.open(url);
        });
    }
]);
idle.setFrom([
    function() {
        off("getStartedButton clicked");
        off("learnMoreButton clicked");
        broadcast("header setClassName", outroAnimation());
    },
    function() {
        broadcast("subHeader setClassName", outroAnimation());
    },
    function() {
        broadcast("getStartedButton setClassName", outroAnimation());
    },
    function() {
        broadcast("learnMoreButton setClassName", outroAnimation());
    },
    function() {
        broadcast("window wipe");
    }
]);

const deployment = StateConstructor();
deployment.setParent("window");
deployment.setCooldown(100n);
deployment.setTo([
    function() {
        broadcast("window pushBelow",
            <Remote name={"collectingDeploymentDataHeader"} initialClassName={introAnimation()}>
                <PurpleTextHeading text={"Let's Get Some Details"} style={{}}/>
            </Remote>
        );
    },
    function() {
        broadcast("window pushBelow",
            <Remote name={"collectingDeploymentDataDiamondName"}>
            </Remote>
        );
    }
]);
deployment.setFrom([]);

export const window = StateMachineConstructor();
window.addState(State.Idle, idle);
window.addState(State.Deployment, deployment);