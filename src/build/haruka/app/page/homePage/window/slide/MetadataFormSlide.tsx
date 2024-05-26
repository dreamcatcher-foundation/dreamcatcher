import React, {type ReactNode, useState, useEffect} from "react";
import Slide from "./Slide.tsx";
import TextFieldHook from "../../../shared/component/input/TextFieldHook.tsx";
import TwoButtonSlot from "./slot/TwoButtonSlot.tsx";
import ButtonHook from "../../../shared/component/input/ButtonHook.tsx";
import {EventsStream} from "../../../../lib/events-emitter/EventsStream.ts";
import GetStartedSlide from "./GetStartedSlide.tsx";
import ColumnHook from "../../../shared/component/layout/ColumnHook.tsx";
import {type EventSubscription} from "fbemitter";
import Text from "../../../shared/component/text/Text.tsx";
import Deployer from "../../../shared/node/Deployer.tsx";
import DeploySlide from "./DeploySlide.tsx";

export default function MetadataFormSlide(): ReactNode {
    let _DAONameField: string | undefined;
    let _DAOTokenNameField: string | undefined;
    let _DAOTokenSymbolField: string | undefined;
    useEffect(function() {
        const subscriptions: EventSubscription[] = [
            EventsStream.createEventSubscription("metadataFormSlide.DAONameField", "INPUT_CHANGE", input => _DAONameField = input),
            EventsStream.createEventSubscription("metadataFormSlide.DAOTokenNameField", "INPUT_CHANGE", input => _DAOTokenNameField = input),
            EventsStream.createEventSubscription("metadataFormSlide.DAOTokenSymbolField", "INPUT_CHANGE", input => _DAOTokenSymbolField = input),
            EventsStream.createEventSubscription("metadataFormSlide.nextButton", "CLICK", function() {
                const formIsValid: boolean = !(!_DAONameField || !_DAOTokenNameField || !_DAOTokenSymbolField);
                if (formIsValid) {
                    Deployer.DAONameField = _DAONameField!;
                    Deployer.DAOTokenNameField = _DAOTokenNameField!;
                    Deployer.DAOTokenSymbolField = _DAOTokenSymbolField!;
                    EventsStream.dispatch("homePage.window", "swap", <DeploySlide/>);
                    return;
                }
                else {
                    EventsStream.dispatch("metadataFormSlide.formMessage", "swap", 
                        <Text
                        text="Please make sure no fields are empty."
                        style={{
                            background: "red"
                        }}/>
                    );
                }
            })
        ];
        return function(): void {
            return subscriptions.forEach(subscription => subscription.remove());
        }
    }, []);
    return (
        <Slide
        nodeKey="metadataFormSlide">
            <ColumnHook
            nodeKey="metadataFormSlide.form"
            style={{
                width: "100%",
                height: "auto",
                gap: "10px"
            }}>
                <TextFieldHook
                uniqueId="metadataFormSlide.DAONameField"
                placeholder="DAO Name: Sunshine Capital"/>
                
                <TextFieldHook
                uniqueId="metadataFormSlide.DAOTokenNameField"
                placeholder="Token Name: Sunshine Token"/>

                <TextFieldHook
                uniqueId="metadataFormSlide.DAOTokenSymbolField"
                placeholder="Token Symbol: vSUN"/>
            </ColumnHook>

            <ColumnHook
            nodeKey="metadataFormSlide.formMessage">
            </ColumnHook>

            <TwoButtonSlot
            nodeKey="metadataFormSlide.twoButtonSlot">
                <ButtonHook
                className="swing-in-top-fwd"
                nodeKey="metadataFormSlide.nextButton"
                color="#615FFF"
                text="Next"/>

                <ButtonHook
                className="swing-in-top-fwd"
                nodeKey="metadataFormSlide.backButton"
                color="#D6D5D4"
                text="Back"
                onClick={() => EventsStream.dispatch("homePage.window", "swap", <GetStartedSlide/>)}/>
            </TwoButtonSlot>
        </Slide>
    );
}