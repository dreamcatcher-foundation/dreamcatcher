import React, {type ReactNode, useEffect} from "react";
import Slide from "./Slide.tsx";
import Text from "../../../shared/components/text/Text.tsx";
import ButtonHook from "../../../shared/components/input/ButtonHook.tsx";
import {type EventSubscription} from "fbemitter";
import {defaultMappedEventEmitter} from "../../../../library/event-driven-architecture/DefaultMappedEventEmitter.ts";
import WelcomeSlide from "./WelcomeSlide.tsx";
import MetadataFormSlide from "./MetadataFormSlide.tsx";
import TwoButtonSlot from "./slot/TwoButtonSlot.tsx";

export default function GetStartedSlide(): ReactNode {
    useEffect(function() {
        const subscriptions: EventSubscription[] = [
            defaultMappedEventEmitter.hookEvent("getStartedSlide.nextButton", "CLICK", function() {
                defaultMappedEventEmitter.post("homePage.window", "swap", <MetadataFormSlide/>);
            }),
            defaultMappedEventEmitter.hookEvent("getStartedSlide.backButton", "CLICK", function() {
                defaultMappedEventEmitter.post("homePage.window", "swap", <WelcomeSlide/>);
            })
        ];
        return function() {
            return subscriptions.forEach(subscription => subscription.remove());
        }
    }, []);
    return (
        <Slide
        uniqueId="getStartedSlide">
            <Text
            text="Deploying a contract is easy, and will only set you back less than a cent.">
            </Text>

            <TwoButtonSlot
            uniqueId="getStartedSlide.twoButtonSlot">
                <ButtonHook
                className="swing-in-top-fwd"
                uniqueId="getStartedSlide.nextButton"
                color="#615FFF"
                text="Next">
                </ButtonHook>

                <ButtonHook
                className="swing-in-top-fwd"
                uniqueId="getStartedSlide.backButton"
                color="#D6D5D4"
                text="Back">
                </ButtonHook>
            </TwoButtonSlot>
        </Slide>
    );
}