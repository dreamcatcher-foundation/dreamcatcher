import { type ReactNode } from "react";
import { useEffect } from "react";
import { EventSubscription } from "fbemitter";
import { Slide } from "@atlas/styled/local/home-page/window/slide/Slide.tsx";
import { Text } from "@atlas/component/text/Text.tsx";
import { ButtonHook } from "@atlas/component/input/ButtonHook.tsx";
import { Stream } from "@atlas/shared/com/Stream.ts";
import { WelcomeSlide } from "@atlas/styled/local/home-page/window/slide/WelcomeSlide.tsx";
import { DoubleButtonSlot } from "@atlas/styled/local/home-page/window/slide/slot/DoubleButtonSlot.tsx";
import React from "react";

function GetStartedSlide(): ReactNode {
    return (
        <Slide
        node="homePage.window.getStartedSlide">
            <Text
            text="Deploying a contract is easy and will....">
            </Text>

            <DoubleButtonSlot
            node="homePage.window.getStartedSlide.doubledButtonSlot">
                <ButtonHook
                className="swing-in-top-fwd"
                node="homePage.window.getStartedSlide.nextButton"
                color="#615FFF"
                text="Next"
                onClick={() => Stream.dispatch({toNode: "homePage.window", command: "swap", item: <div>Collect Metadata Slide</div>})}>
                </ButtonHook>

                <ButtonHook
                className="swing-in-top-fwd"
                node="homePage.window.getStartedSlide.backButton"
                color="#D6D5D4"
                text="Back"
                onClick={() => Stream.dispatch({toNode: "homePage.window", command: "swap", item: <WelcomeSlide/>})}>
                </ButtonHook>
            </DoubleButtonSlot>
        </Slide>
    );
}

export { GetStartedSlide };