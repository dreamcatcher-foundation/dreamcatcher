import { type ReactNode } from "react";
import { Slide } from "@atlas/styled/local/home-page/window/slide/Slide.tsx";
import { Text } from "@atlas/component/text/Text.tsx";
import { ButtonHook } from "@atlas/component/input/ButtonHook.tsx";
import { LinkedButtonHook } from "@atlas/component/input/LinkedButtonHook.tsx";
import { Stream } from "@atlas/shared/com/Stream.ts";
import { ColumnHook } from "@atlas/component/layout/ColumnHook.tsx";
import { DoubleButtonSlot } from "@atlas/styled/local/home-page/window/slide/slot/DoubleButtonSlot.tsx";
import { GetStartedSlide } from "@atlas/styled/local/home-page/window/slide/GetStartedSlide.tsx";
import React from "react";

function WelcomeSlide(): ReactNode {
    return (
        <Slide
        node="homePage.welcomeSlide">
            <ColumnHook
            node="homePage.welcomeSlide.heroSlot">
                <Text
                className="swing-in-top-fwd"
                text="Your Gateway Drug"
                style={{
                    fontSize: "30px",
                    background: "#615FFF",
                    alignSelf: "start"
                }}>
                </Text>

                <Text
                className="swing-in-top-fwd"
                text="Dreamcatcher is a cross-chain DAO protocol designed to host infinitely scalable, modular, and eternal smart contracts which interact can interact with each other."
                style={{
                    fontSize: "15px",
                    alignSelf: "start"
                }}>
                </Text>
            </ColumnHook>

            <DoubleButtonSlot
            node="homePage.welcomeSlide.doubleButtonSlot">
                <ButtonHook
                className="swing-in-top-fwd"
                node="homePage.welcomeSlide.getStartedButton"
                color="#615FFF"
                text="Get Started"
                onClick={() => Stream.dispatch({toNode: "homePage.window", command: "swap", item: <GetStartedSlide/>})}>
                </ButtonHook>

                <LinkedButtonHook
                className="swing-in-top-fwd"
                node="homePage.welcomeSlide.learnMoreButton"
                color="#D6D5D4"
                link="https://dreamcatcher-1.gitbook.io/dreamcatcher"
                text="Learn More">
                </LinkedButtonHook>
            </DoubleButtonSlot>
        </Slide>
    );
}

export { WelcomeSlide };