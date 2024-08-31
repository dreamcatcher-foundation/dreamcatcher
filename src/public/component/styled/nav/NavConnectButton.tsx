import type {ReactNode} from "react";
import type {ClientErrorCode} from "@component/Client";
import {Typography} from "@component/Typography";
import {FlexCol} from "@component/FlexCol";
import {FlexRow} from "@component/FlexRow";
import {Sprite} from "@component/Sprite";
import {createMachine as Machine} from "xstate";
import {useSpring} from "react-spring";
import {useMachine} from "@xstate/react";
import {useMemo} from "react";
import {useState} from "react";
import {connect} from "@component/Client";
import {textShadowGlow} from "@component/TextShadowGlow";
import {ifEthersError} from "@lib/EthersErrorParser";
import {ifFault} from "@lib/ErrorHandler";
import * as ColorPalette from "@component/ColorPalette";

export function NavConnectButton(): ReactNode {
    let [captionSpring, setCaptionSpring] = useSpring(() => ({fontSize: "1.5em", cursor: "pointer", textShadow: textShadowGlow(ColorPalette.TITANIUM.toString(), 0)}));
    let [feedbackMessageSpring, setFeedbackMessageSpring] = useSpring(() => ({color: ColorPalette.RED.toString(), fontSize: "0.5em"}));
    let [loaderSpriteSpring, setLoaderSpriteSpring] = useSpring(() => ({opacity: "0"}));
    let [feedbackMessage, setFeedbackMessage] = useState<string>("");
    let [_, setNavConnectButton] = useMachine(useMemo(() => Machine({
        /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgCMB7CgFwGIILCBtABgF1FQAHC2Xa3I04gAHogBMLAKwkAnOIAcARkULZUgMwqAbOIA0IAJ4TtAdhJnl4gCwbx62dtkBfZwbRY8hUrggAbMFpUCgBXWDAAUXxqMAAnVg4kEB4+ASEksQRxJRYSJW0pbQ11FlklcqlrA2MEWVzTazVCyoKNKSUpV3cMHAJiEiwBADdA4LCwABkwdBGE4RT+QXxhTMkZeSsFJq1xXWrEJWtchQ0WSTVZU5ZTE9c3EHwKCDhhD17ved5F9NBMgFptPsEACSCwweCIRDTF0QG8vP1KDRPqklitENZ9EYJNZrBZTFJwdZtNocgpOvc4X0fP4wMjvssMogNNpcopbGoWETFPkgSpcnZTCwySp1EpLuTup4qQNMMNaUkFmkGb90ZiaspQZcGlqFLp8uIYZTvCRMIxCLK6Uq0QhtLiNIKtIdsuJTo1ebq8lZrOopJJTCoDXcgA */
        initial: "boot",
        states: {
            boot: {
                entry: () => {
                    return (async () => {
                        setCaptionSpring.start({cursor: "progress"});
                        setLoaderSpriteSpring.start({opacity: "1"});
                        try {
                            await connect();
                            setFeedbackMessageSpring.start({color: ColorPalette.TEAL.toString()});
                            setFeedbackMessage("You are connected.");
                            setCaptionSpring.start({cursor: "pointer"});
                            setLoaderSpriteSpring.start({opacity: "0"});
                            setNavConnectButton({type: "done"});
                            return;
                        }
                        catch (e: unknown) {
                            setFeedbackMessageSpring.start({color: ColorPalette.RED.toString()});
                            setFeedbackMessage("Something went wrong.");
                            ifEthersError(e, "ACTION_REJECTED", () => setFeedbackMessage("Connection rejected."));
                            ifFault<ClientErrorCode>(e, "session-missing-provider", () => setFeedbackMessage("Please install a web3 wallet."));
                            ifFault<ClientErrorCode>(e, "session-missing-accounts", () => setFeedbackMessage("No accounts detected."));
                            setCaptionSpring.start({cursor: "pointer"});
                            setLoaderSpriteSpring.start({opacity: "0"});
                            setNavConnectButton({type: "done"});
                            return;
                        }
                    })();
                },
                on: {
                    done: "idle"
                }
            },
            idle: {
                entry: () => {
                    setLoaderSpriteSpring.start({opacity: "0"});
                    setCaptionSpring.start({cursor: "pointer"});
                    setCaptionSpring.start({textShadow: textShadowGlow(ColorPalette.TITANIUM.toString(), 0)});
                    return;
                },
                on: {
                    mouseEnter: "active"
                }
            },
            active: {
                entry: () => {
                    setCaptionSpring.start({textShadow: textShadowGlow(ColorPalette.TITANIUM.toString(), 1)});
                    return;
                },
                on: {
                    mouseLeave: "idle",
                    click: "connect"
                }
            },
            connect: {
                entry: () => {
                    return (async () => {
                        setCaptionSpring.start({cursor: "progress"});
                        setLoaderSpriteSpring.start({opacity: "1"});
                        try {
                            await connect();
                            setFeedbackMessageSpring.start({color: ColorPalette.TEAL.toString()});
                            setFeedbackMessage("You are connected.");
                            setCaptionSpring.start({cursor: "pointer"});
                            setLoaderSpriteSpring.start({opacity: "0"});
                            setNavConnectButton({type: "done"});
                            return;
                        }
                        catch (e: unknown) {
                            setFeedbackMessageSpring.start({color: ColorPalette.RED.toString()});
                            setFeedbackMessage("Something went wrong.");
                            ifEthersError(e, "ACTION_REJECTED", () => setFeedbackMessage("Connection rejected."));
                            ifFault<ClientErrorCode>(e, "session-missing-provider", () => setFeedbackMessage("Please install a web3 wallet."));
                            ifFault<ClientErrorCode>(e, "session-missing-accounts", () => setFeedbackMessage("No accounts detected."));
                            setCaptionSpring.start({cursor: "pointer"});
                            setLoaderSpriteSpring.start({opacity: "0"});
                            setNavConnectButton({type: "done"});
                            return;
                        }
                    })();
                },
                on: {
                    done: "idle"
                }
            }
        }
    }), [
        setCaptionSpring,
        setFeedbackMessageSpring,
        setLoaderSpriteSpring,
        setFeedbackMessage
    ]));
    return <>
        <FlexRow>
            <FlexCol 
            onMouseEnter={() => setNavConnectButton({type: "mouseEnter"})} 
            onMouseLeave={() => setNavConnectButton({type: "mouseLeave"})}
            onClick={() => setNavConnectButton({type: "click"})}>
                <FlexRow
                style={{
                width: "100%",
                justifyContent: "start"
                }}>
                    <Typography
                    content="Connect"
                    style={{
                    pointerEvents: "auto",
                    ... captionSpring
                    }}/>

                    <Sprite
                    src="../../../img/animation/loader/Radio.svg"
                    style={{
                    width: "25px",
                    aspectRatio: "1/1",
                    ... loaderSpriteSpring
                    }}/>
                </FlexRow>

                <FlexRow
                style={{
                width: "100%",
                justifyContent: "start"
                }}>
                    <Typography
                    content={feedbackMessage}
                    style={{
                    ... feedbackMessageSpring
                    }}/>
                </FlexRow>
            </FlexCol>
        </FlexRow>
    </>;
}