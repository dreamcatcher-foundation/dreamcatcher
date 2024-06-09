import React, {type ReactNode, useEffect} from "react";
import Slide from "./Slide.tsx";
import Text from "../../../shared/component/text/Text.tsx";
import ButtonHook from "../../../shared/component/input/ButtonHook.tsx";
import {type EventSubscription} from "fbemitter";
import {EventsStream} from "../../../../lib/events-emitter/EventsStream.ts";
import WelcomeSlide from "./WelcomeSlide.tsx";
import MetadataFormSlide from "./MetadataFormSlide.tsx";
import TwoButtonSlot from "./slot/TwoButtonSlot.tsx";

export default function GetStartedSlide(): ReactNode {
    useEffect(function() {
        const subscriptions: EventSubscription[] = [
            EventsStream.createEventSubscription("getStartedSlide.nextButton", "CLICK", function() {
                EventsStream.dispatch("homePage.window", "swap", <MetadataFormSlide/>);
            }),
            EventsStream.createEventSubscription("getStartedSlide.backButton", "CLICK", function() {
                EventsStream.dispatch("homePage.window", "swap", <WelcomeSlide/>);
            })
        ];
        return function() {
            return subscriptions.forEach(subscription => subscription.remove());
        }
    }, []);
    return (
        <Slide
        nodeKey="getStartedSlide">
            <Text
            text="Deploying a contract is easy, and will only set you back less than a cent.">
            </Text>

            <TwoButtonSlot
            nodeKey="getStartedSlide.twoButtonSlot">
                <ButtonHook
                className="swing-in-top-fwd"
                nodeKey="getStartedSlide.nextButton"
                color="#615FFF"
                text="Next">
                </ButtonHook>

                <ButtonHook
                className="swing-in-top-fwd"
                nodeKey="getStartedSlide.backButton"
                color="#D6D5D4"
                text="Back">
                </ButtonHook>
            </TwoButtonSlot>
        </Slide>
    );
}