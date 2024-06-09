import { type ReactNode } from "react";
import { ethers as Ethers } from "ethers";
import { EventSubscription } from "fbemitter";
import { useEffect } from "react";
import { Slide } from "@atlas/styled/local/home-page/window/slide/Slide.tsx";
import { DoubleButtonSlot } from "@atlas/styled/local/home-page/window/slide/slot/DoubleButtonSlot.tsx";
import { HeadingSlot } from "@atlas/styled/local/home-page/window/slide/slot/HeadingSlot.tsx";
import { ContentSlot } from "@atlas/styled/local/home-page/window/slide/slot/ContentSlot.tsx";
import { Text } from "@atlas/component/text/Text.tsx";
import { RowHook } from "@atlas/component/layout/RowHook.tsx";
import { ToggleHook } from "@atlas/component/input/ToggleHook.tsx";
import { EventBus } from "@atlas/class/eventBus/EventBus.ts";
import { WindowDeploymentTracker } from "@atlas/styled/local/home-page/window/Window.tsx";
import { ButtonHook } from "@atlas/component/input/ButtonHook.tsx";
import { GetStartedSlide } from "@atlas/styled/local/home-page/window/slide/GetStartedSlide.tsx";
import { ReactWeb3 } from "@atlas/class/web/react/ReactWeb3.tsx";
import { Url } from "@atlas/class/web/Url.ts";
import React from "react";

function ExtensionsSlide(): ReactNode {
    useEffect(function() {
        let subscriptions: EventBus.ISubscription[] = [
            new EventBus.EventSubscription({
                "from": "homePage.window.extensionsSlide.contentSlot.extension0.toggle",
                "event": "toggle",
                "handler"(item?: unknown): void {
                    if (!item) {
                        return;
                    }
                    if (typeof item !== "boolean") {
                        return;
                    }
                    WindowDeploymentTracker.selectedErc20Extension = item;
                    return;
                }
            }),
            new EventBus.EventSubscription({
                "from": "homePage.window.extensionsSlide.contentSlot.extension1.toggle",
                "event": "toggle",
                "handler"(item?: unknown): void {
                    if (!item) {
                        return;
                    }
                    if (typeof item !== "boolean") {
                        return;
                    }
                    WindowDeploymentTracker.selectedAuthExtension = item;
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
                "height": "12.5%"
            }}>
                <Text
                text="Extensions"
                style={{
                "fontSize": "30px",
                "background": "#615FFF",
                "alignSelf": "center"
                }}/>
            </HeadingSlot>
            
            <ContentSlot
            node="homePage.window.extensionsSlide.contentSlot"
            style={{
                "height": "70%",
                "overflowX": "hidden",
                "overflowY": "scroll",
                "flexDirection": "column",
                "display": "flex",
                "alignItems": "start",
                "justifyContent": "start",
            }}>
                <RowHook
                node="homePage.window.extensionsSlide.contentSlot.extension0"
                style={{
                    "width": "100%",
                    "height": "50px",
                    "gap": "10px",
                    "justifyContent": "start"
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
                    "width": "100%",
                    "height": "50px",
                    "gap": "10px",
                    "justifyContent": "start"
                }}>
                    <ToggleHook
                    node="homePage.window.extensionsSlide.contentSlot.extension1.toggle"
                    isToggled/>

                    <Text
                    text="Auth"/>

                    <Text
                    text="Recommended"
                    style={{
                        "background": "#FF1802"
                    }}/>
                </RowHook>
            </ContentSlot>

            <DoubleButtonSlot
            node="homePage.window.extensionsSlide.doubleButtonSlot"
            style={{
                "height": "12.5%"
            }}>
                <ButtonHook
                node="homePage.window.extensionsSlide.doubleButtonSlot.nextButton"
                className="swing-in-top-fwd"
                color="#615FFF"
                text="Deploy"
                onClick={async function(): Promise<void> {

                    console.log(await ReactWeb3.invokeRaw({
                        "chainId": 137n,
                        "confirmations": 1n,
                        "gasPrice": "normal",
                        "methodSignature": "function deploy() external returns (address)",
                        "methodName": "deploy",
                        "methodArgs": [],
                        "to": "0x49dABC96174Ae8Df1b5b6a6823199D029A54aE86",
                        "value": 0n
                    }));
                }}/>

                <ButtonHook
                node="homePage.window.extensionsSlide.doubleButtonSlot.backButton"
                className="swing-in-top-fwd"
                color="#615FFF"
                text="Back"
                onClick={function() {
                    new EventBus.Message({
                        "to": "homePage.window",
                        "message": "swap",
                        "item": <GetStartedSlide/>
                    });
                    return;
                }}/>
            </DoubleButtonSlot>
        </Slide>
    );
}

export { ExtensionsSlide };