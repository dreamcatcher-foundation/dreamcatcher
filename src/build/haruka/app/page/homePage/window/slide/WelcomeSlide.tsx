import React, {type ReactNode} from "react";
import Slide from "./Slide.tsx";
import Text from "../../../shared/component/text/Text.tsx";
import ButtonHook from "../../../shared/component/input/ButtonHook.tsx";
import ButtonLink from "../../../shared/component/input/ButtonLink.tsx";
import {EventsStream} from "../../../../lib/events-emitter/EventsStream.ts";
import GetStartedSlide from "./GetStartedSlide.tsx";
import TwoButtonSlot from "./slot/TwoButtonSlot.tsx";
import ColumnHook from "../../../shared/component/layout/ColumnHook.tsx";

export default function WelcomeSlide(): ReactNode {
    return (
        <Slide
        nodeKey="welcomeSlide">
            <ColumnHook
            nodeKey="welcomeSlide.heroSlot">
                <Text
                className="swing-in-top-fwd"
                text="Your Gateway Drug To DeFi"
                style={{
                    fontSize: "30px",
                    background: "#615FFF",
                    alignSelf: "start"
                }}/>

                <Text
                className="swing-in-top-fwd"
                text="Dreamcatcher is a cross-chain DAO protocol designed to host infinitely scalable, modular, and eternal smart contracts which interact can interact with each other."
                style={{
                    fontSize: "15px",
                    alignSelf: "start"
                }}/>
            </ColumnHook>

            <TwoButtonSlot
            nodeKey="welcomeSlide.twoButtonSlot">
                <ButtonHook
                className="swing-in-top-fwd"
                nodeKey="welcomeSlide.getStartedButton"
                color="#615FFF"
                text="Get Started"
                onClick={() => EventsStream.dispatch("homePage.window", "swap", <GetStartedSlide/>)}/>

                <ButtonLink
                className="swing-in-top-fwd"
                nodeKey="welcomeSlide.learnMoreButton"
                link="https://dreamcatcher-1.gitbook.io/dreamcatcher"
                color="#D6D5D4"
                text="Learn More"/>
            </TwoButtonSlot>
        </Slide>
    );
}