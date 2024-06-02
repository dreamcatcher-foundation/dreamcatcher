import { type ReactNode } from "react";
import { EventSubscription } from "fbemitter";
import { useEffect } from "react";
import { Slide } from "@atlas/styled/local/home-page/window/slide/Slide.tsx";
import { DoubleButtonSlot } from "@atlas/styled/local/home-page/window/slide/slot/DoubleButtonSlot.tsx";
import { HeadingSlot } from "@atlas/styled/local/home-page/window/slide/slot/HeadingSlot.tsx";
import { ContentSlot } from "@atlas/styled/local/home-page/window/slide/slot/ContentSlot.tsx";
import { Text } from "@atlas/component/text/Text.tsx";
import { RowHook } from "@atlas/component/layout/RowHook.tsx";
import { ToggleHook } from "@atlas/component/input/ToggleHook.tsx";
import { Stream } from "@atlas/shared/com/Stream.ts";
import { WindowDeploymentTracker } from "@atlas/styled/local/home-page/window/Window.tsx";
import { ButtonHook } from "@atlas/component/input/ButtonHook.tsx";
import { GetStartedSlide } from "@atlas/styled/local/home-page/window/slide/GetStartedSlide.tsx";
import { Transaction } from "../../../../../component/class/evm/Transaction.tsx";
import React from "react";

function ExtensionsSlide(): ReactNode {
    useEffect(function() {
        let subscriptions: EventSubscription[] = [
            Stream.createEventSubscription({
                fromNode: "homePage.window.extensionsSlide.contentSlot.extension0.toggle",
                event: "toggle",
                hook(state: boolean) {
                    if (state) {
                        WindowDeploymentTracker.selectedErc20Extension = true;
                        return;
                    }
                    WindowDeploymentTracker.selectedErc20Extension = false;
                    return;
                },
            }),
            Stream.createEventSubscription({
                fromNode: "homePage.window.extensionsSlide.contentSlot.extension1.toggle",
                event: "toggle",
                hook(state: boolean) {
                    if (state) {
                        WindowDeploymentTracker.selectedAuthExtension = true;
                        return;
                    }
                    WindowDeploymentTracker.selectedAuthExtension = false;
                    return;
                },
            })
        ];
        return () => subscriptions.forEach(subscription => subscription.remove());
    }, []);
    return (
        <Slide
        node="homePage.window.extensionsSlide">
            <HeadingSlot
            node="homePage.window.extensionsSlide.headingSlot"
            style={{
            height: "12.5%"
            }}>
                <Text
                text="Extensions"
                style={{
                fontSize: "30px",
                background: "#615FFF",
                alignSelf: "center"
                }}/>
            </HeadingSlot>
            
            <ContentSlot
            node="homePage.window.extensionsSlide.contentSlot"
            style={{
            height: "70%",
            overflowX: "hidden",
            overflowY: "scroll",
            flexDirection: "column",
            display: "flex",
            alignItems: "start",
            justifyContent: "start",
            }}>
                <RowHook
                node="homePage.window.extensionsSlide.contentSlot.extension0"
                style={{
                    width: "100%",
                    height: "50px",
                    gap: "10px",
                    justifyContent: "start"
                }}>
                    <ToggleHook
                    node="homePage.window.extensionsSlide.contentSlot.extension0.toggle"/>

                    <Text
                    text="ERC20"/>

                    <Text
                    text=""
                    style={{
                        background: "#FF1802"
                    }}/>
                </RowHook>

                <RowHook
                node="homePage.window.extensionsSlide.contentSlot.extension1"
                style={{
                    width: "100%",
                    height: "50px",
                    gap: "10px",
                    justifyContent: "start"
                }}>
                    <ToggleHook
                    node="homePage.window.extensionsSlide.contentSlot.extension1.toggle"
                    isToggled/>

                    <Text
                    text="Auth"/>

                    <Text
                    text="Recommended"
                    style={{
                        background: "#FF1802"
                    }}/>
                </RowHook>
            </ContentSlot>

            <DoubleButtonSlot
            node="homePage.window.extensionsSlide.doubleButtonSlot"
            style={{
            height: "12.5%"
            }}>
                <ButtonHook
                node="homePage.window.extensionsSlide.doubleButtonSlot.nextButton"
                className="swing-in-top-fwd"
                color="#615FFF"
                text="Deploy"
                onClick={async function() {
                    let result = await new Transaction({
                        to: "",
                        rpcUrl: "",
                        methodName: "",
                        methodArgs: [],
                        abi: []
                    }).receipt();
                    console.log(result);
                }}/>

                <ButtonHook
                node="homePage.window.extensionsSlide.doubleButtonSlot.backButton"
                className="swing-in-top-fwd"
                color="#615FFF"
                text="Back"
                onClick={function() {
                Stream.dispatch({
                    toNode: "homePage.window",
                    command: "swap",
                    item: <GetStartedSlide/>
                });
                return;
                }}/>
            </DoubleButtonSlot>
        </Slide>
    );
}

export { ExtensionsSlide };