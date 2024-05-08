import React, {type ReactNode} from "react";
import Slide from "./Slide.tsx";
import Text from "../../../shared/components/text/Text.tsx";
import ButtonHook from "../../../shared/components/input/ButtonHook.tsx";
import ButtonLink from "../../../shared/components/input/ButtonLink.tsx";
import {defaultMappedEventEmitter} from "../../../../library/event-driven-architecture/DefaultMappedEventEmitter.ts";
import GetStartedSlide from "./GetStartedSlide.tsx";
import TwoButtonSlot from "./slot/TwoButtonSlot.tsx";
import ColumnHook from "../../../shared/components/layout/ColumnHook.tsx";

export default function WelcomeSlide(): ReactNode {
    return (
        <Slide
        uniqueId="welcomeSlide">
            <ColumnHook
            uniqueId="welcomeSlide.heroSlot">
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
            uniqueId="welcomeSlide.twoButtonSlot">
                <ButtonHook
                className="swing-in-top-fwd"
                uniqueId="welcomeSlide.getStartedButton"
                color="#615FFF"
                text="Get Started"
                onClick={() => defaultMappedEventEmitter.post("homePage.window", "swap", <GetStartedSlide/>)}/>

                <ButtonLink
                className="swing-in-top-fwd"
                uniqueId="welcomeSlide.learnMoreButton"
                link="https://dreamcatcher-1.gitbook.io/dreamcatcher"
                color="#D6D5D4"
                text="Learn More"/>
            </TwoButtonSlot>
        </Slide>
    );
}