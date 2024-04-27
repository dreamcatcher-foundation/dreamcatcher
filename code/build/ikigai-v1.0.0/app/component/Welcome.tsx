import React, {useEffect} from "react";
import {Header} from "./Header.tsx";
import {RenderedRESTContainer, RenderedContainer, RenderedRow, RenderedButton0, RenderedButton1, RenderedText} from "./Rendered_.tsx";
import {on, post, render, cleanup, EventSubscription} from "../operator/Emitter.ts";
import {Input} from "./UI.tsx";

export type IWelcomeProps = ({});

export function Welcome(props: IWelcomeProps) {
    const {} = props;

    const args = ({
        nodeId: "Welcome",
        initialStyle: ({
            width: "450px",
            height: "450px",
            borderWidth: "1px",
            borderStyle: "solid",
            borderImage: "linear-gradient(to bottom, transparent, #505050) 1",
            background: "rgba(255, 255, 255, 0)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(3.2px)",
            WebkitBackdropFilter: "blur(3.2px)",
            display: "flex",
            flexDirection: "column"
        }) as const,
        containers: ([
            <WelcomeIdle></WelcomeIdle>,
            <WelcomeSettings></WelcomeSettings>
        ]),
        initialState: 0n
    });

    return (
        <RenderedRESTContainer {...args}></RenderedRESTContainer>
    );
}

export function WelcomeIdle() {
    useEffect(function() {
        const subs: EventSubscription[] = ([
            on({
                sender: "WelcomeIdleButton0",
                message: "Click",
                handler: () => render({
                    recipient: "Welcome",
                    state: 1n
                })
            }),
            on({
                sender: "WelcomeIdleButton1",
                message: "Click",
                handler: () => (window as any).open("https://dreamcatcher-1.gitbook.io/dreamcatcher")
            })
        ]);

        return cleanup(subs);
    }, []);

    const args = ({
        nodeId: "WelcomeIdle",
        initialStyle: ({
            width: "100%",
            height: "100%",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "40px"
        }) as const
    });

    const buttonsContainerArgs = ({
        nodeId: "WelcomeIdleButtonContainer",
        w: "100%",
        h: "auto",
        initialStyle: ({
            gap: "30px"
        }) as const
    });

    const buttonArgs0 = ({
        nodeId: "WelcomeIdleButton0",
        initialText: "Get Started"
    });

    const buttonArgs1 = ({
        nodeId: "WelcomeIdleButton1",
        initialText: "Learn More"
    });

    return (
        <RenderedContainer {...args}>
            <Header></Header>
            <RenderedRow {...buttonsContainerArgs}>
                <RenderedButton0 {...buttonArgs0}></RenderedButton0>
                <RenderedButton1 {...buttonArgs1}></RenderedButton1>
            </RenderedRow>
        </RenderedContainer>
    );
}

export function WelcomeSettings() {
    useEffect(function() {
        const subs: EventSubscription[] = ([
            on({
                sender: "WelcomeSettingsButton0",
                message: "Click",
                handler: async function() {
                    const ok: boolean = await post({
                        recipient: "Deployment",
                        message: "IsOkForPhase2Request"
                    });

                    if (ok) {
                        render({
                            recipient: "Welcome",
                            state: 2n
                        });
                    }
                }
            }),
            on({
                sender: "WelcomeSettingsButton1",
                message: "Click",
                handler: () => render({
                    recipient: "Welcome",
                    state: 0n
                })
            })
        ]);

        return cleanup(subs);
    }, []);

    const args = ({
        nodeId: "WelcomeSettings",
        initialStyle: ({
            width: "100%",
            height: "100%",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "40px"
        }) as const
    });

    const headingArgs = ({
        nodeId: "WelcomeSettingsHeading",
        initialText: "Settings",
        initialStyle: ({
            fontSize: "2em",
            background: "#615FFF"
        })
    });

    const inputArgs0 = ({
        nodeId: "WelcomeSettingsInput0",
        placeholder: "Dreamcatcher Capital"
    });

    const inputArgs1 = ({
        nodeId: "WelcomeSettingsInput1",
        placeholder: "Dream Token"
    });

    const inputArgs2 = ({
        nodeId: "WelcomeSettingsInput2",
        placeholder: "vDREAM"
    });

    const buttonsContainerArgs = ({
        nodeId: "WelcomeSettingsButtonContainer",
        w: "100%",
        h: "auto",
        initialStyle: ({
            gap: "30px"
        })
    });

    const buttonArgs0 = ({
        nodeId: "WelcomeSettingsButton0",
        initialText: "Next"
    });

    const buttonArgs1 = ({
        nodeId: "WelcomeSettingsButton1",
        initialText: "Back"
    });

    return (
        <RenderedContainer {...args}>
            <RenderedText {...headingArgs}></RenderedText>
            <Input {...inputArgs0}></Input>
            <Input {...inputArgs1}></Input>
            <Input {...inputArgs2}></Input>
            <RenderedRow {...buttonsContainerArgs}>
                <RenderedButton0 {...buttonArgs0}></RenderedButton0>
                <RenderedButton1 {...buttonArgs1}></RenderedButton1>
            </RenderedRow>
        </RenderedContainer>
    );
}