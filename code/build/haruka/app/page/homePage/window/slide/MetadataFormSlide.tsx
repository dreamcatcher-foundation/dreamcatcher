import React, {type ReactNode, useState, useEffect} from "react";
import Slide from "./Slide.tsx";
import TextFieldHook from "../../../shared/components/input/TextFieldHook.tsx";
import TwoButtonSlot from "./slot/TwoButtonSlot.tsx";
import ButtonHook from "../../../shared/components/input/ButtonHook.tsx";
import {defaultMappedEventEmitter} from "../../../../library/messenger/DefaultMappedEventEmitter.ts";
import GetStartedSlide from "./GetStartedSlide.tsx";
import ColumnHook from "../../../shared/components/layout/ColumnHook.tsx";
import {type EventSubscription} from "fbemitter";
import Text from "../../../shared/components/text/Text.tsx";
import DeployerNode from "../../../shared/node/DeployerNode.tsx";

export default function MetadataFormSlide(): ReactNode {
    let _DAONameField: string | undefined;
    let _DAOTokenNameField: string | undefined;
    let _DAOTokenSymbolField: string | undefined;
    useEffect(function() {
        const subscriptions: EventSubscription[] = [
            defaultMappedEventEmitter.hookEvent("metadataFormSlide.DAONameField", "INPUT_CHANGE", input => _DAONameField = input),
            defaultMappedEventEmitter.hookEvent("metadataFormSlide.DAOTokenNameField", "INPUT_CHANGE", input => _DAOTokenNameField = input),
            defaultMappedEventEmitter.hookEvent("metadataFormSlide.DAOTokenSymbolField", "INPUT_CHANGE", input => _DAOTokenSymbolField = input),
            defaultMappedEventEmitter.hookEvent("metadataFormSlide.nextButton", "CLICK", function() {
                const formIsValid: boolean = !(!_DAONameField || !_DAOTokenNameField || !_DAOTokenSymbolField);
                if (formIsValid) {
                    DeployerNode
                        .setDAONameField(_DAONameField!)
                        .setDAOTokenNameField(_DAOTokenNameField!)
                        .setDAOTokenSymbolField(_DAOTokenSymbolField!);
                    defaultMappedEventEmitter.post("homePage.window", "swap", <GetStartedSlide/>);
                    return;
                }
                else {
                    defaultMappedEventEmitter.post("metadataFormSlide.formMessage", "swap", 
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
        uniqueId="metadataFormSlide">
            <ColumnHook
            uniqueId="metadataFormSlide.form"
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
            uniqueId="metadataFormSlide.formMessage">
            </ColumnHook>

            <TwoButtonSlot
            uniqueId="metadataFormSlide.twoButtonSlot">
                <ButtonHook
                className="swing-in-top-fwd"
                uniqueId="metadataFormSlide.nextButton"
                color="#615FFF"
                text="Next"/>

                <ButtonHook
                className="swing-in-top-fwd"
                uniqueId="metadataFormSlide.backButton"
                color="#D6D5D4"
                text="Back"
                onClick={() => defaultMappedEventEmitter.post("homePage.window", "swap", <GetStartedSlide/>)}/>
            </TwoButtonSlot>
        </Slide>
    );
}