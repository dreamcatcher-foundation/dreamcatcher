import { type ReactNode } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { EventSubscription } from "fbemitter";
import { Slide } from "@atlas/styled/local/home-page/window/slide/Slide.tsx";
import { Text } from "@atlas/component/text/Text.tsx";
import { ButtonHook } from "@atlas/component/input/ButtonHook.tsx";
import { Stream } from "@atlas/shared/com/Stream.ts";
import { WelcomeSlide } from "@atlas/styled/local/home-page/window/slide/WelcomeSlide.tsx";
import { DoubleButtonSlot } from "@atlas/styled/local/home-page/window/slide/slot/DoubleButtonSlot.tsx";
import { HeadingSlot } from "@atlas/styled/local/home-page/window/slide/slot/HeadingSlot.tsx";
import { ContentSlot } from "@atlas/styled/local/home-page/window/slide/slot/ContentSlot.tsx";
import { TextFieldHook } from "@atlas/component/input/TextFieldHook.tsx";
import { ColumnHook } from "@atlas/component/layout/ColumnHook.tsx";
import { TextHook } from "@atlas/component/text/TextHook.tsx";
import { ExtensionsSlide } from "@atlas/styled/local/home-page/window/slide/ExtensionsSlide.tsx";
import { WindowDeploymentTracker } from "@atlas/styled/local/home-page/window/Window.tsx";
import React from "react";

function GetStartedSlide(): ReactNode {
    useEffect(function() {
        let subscriptions: EventSubscription[] = [
            Stream.createEventSubscription({
                fromNode: "homePage.window.getStartedSlide.contentSlot.col.input0",
                event: "inputChange",
                hook(name: string) {
                    WindowDeploymentTracker.daoName = name;
                }
            }),
            Stream.createEventSubscription({
                fromNode: "homePage.window.getStartedSlide.contentSlot.col.input1",
                event: "inputChange",
                hook(tokenName: string) {
                    WindowDeploymentTracker.daoTokenName = tokenName;
                }
            }),
            Stream.createEventSubscription({
                fromNode: "homePage.window.getStartedSlide.contentSlot.col.input2",
                event: "inputChange",
                hook(symbol: string) {
                    WindowDeploymentTracker.daoTokenSymbol = symbol;
                },
            })
        ];
        return () => subscriptions.forEach(subscription => subscription.remove());
    }, []);
    return (
        <Slide node="homePage.window.getStartedSlide">
            <HeadingSlot 
            node="homePage.window.getStartedSlide.headingSlot"
            style={{
            height: "12.5%"
            }}>
                <Text
                text="Get Started"
                style={{
                fontSize: "30px",
                background: "#615FFF",
                alignSelf: "center"
                }}/>
            </HeadingSlot>

            <ContentSlot
            node="homePage.window.getStartedSlide.contentSlot"
            style={{
            height: "70%"
            }}>
                <ColumnHook
                node="homePage.window.getStartedSlide.contentSlot.col"
                style={{
                width: "100%",
                height: "100%",
                gap: "10px",
                justifyContent: "start"
                }}>
                    <TextFieldHook
                    node="homePage.window.getStartedSlide.contentSlot.col.input0"
                    placeholder="Soda Capital"
                    style={{
                    borderColor: "#858585",
                    outline: "none"
                    }}/>

                    <TextFieldHook
                    node="homePage.window.getStartedSlide.contentSlot.col.input1"
                    placeholder="Soda Token"
                    style={{
                    borderColor: "#858585",
                    outline: "none"
                    }}/>

                    <TextFieldHook
                    node="homePage.window.getStartedSlide.contentSlot.col.input2"
                    placeholder="vSODA"
                    style={{
                    borderColor: "#858585",
                    outline: "none"
                    }}/>

                    <TextHook
                    node="homePage.window.getStartedSlide.contentSlot.col.feedback"
                    text=""
                    style={{
                    width: "100%",
                    fontSize: "10px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center"
                    }}
                    color="#FF1802"/>      
                </ColumnHook>
            </ContentSlot>

            <DoubleButtonSlot
            node="homePage.window.getStartedSlide.doubleButtonSlot"
            style={{
            height: "12.5%"
            }}>
                <ButtonHook
                node="homePage.window.getStartedSlide.doubleButtonSlot.nextButton"
                className="swing-in-top-fwd"
                color="#615FFF"
                text="Next"
                onClick={function() {
                if (WindowDeploymentTracker.daoName === "" || WindowDeploymentTracker.daoTokenName === "" || WindowDeploymentTracker.daoTokenSymbol === "") {
                    Stream.dispatch({
                        toNode: "homePage.window.getStartedSlide.contentSlot.col.feedback",
                        command: "setText",
                        item: "An input field has been left empty."
                    });
                    return;
                }
                Stream.dispatch({
                    toNode: "homePage.window",
                    command: "swap",
                    item: <ExtensionsSlide/>
                });
                return;
                }}/>

                <ButtonHook
                node="homePage.window.getStartedSlide.doubleButtonSlot.backButton"
                className="swing-in-top-fwd"
                color="#615FFF"
                text="Back"
                onClick={function() {
                Stream.dispatch({
                    toNode: "homePage.window",
                    command: "swap",
                    item: <WelcomeSlide/>
                });
                }}/>
            </DoubleButtonSlot>
        </Slide>
    );
}

export { GetStartedSlide };