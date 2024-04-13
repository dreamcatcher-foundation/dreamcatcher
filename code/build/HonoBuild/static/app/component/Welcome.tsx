import React, {useEffect} from 'react';
import {Header} from './Header.tsx';
import {RenderedRESTContainer, RenderedContainer, RenderedRow, RenderedButton0, RenderedButton1, RenderedText} from './Rendered.tsx';
import {Message, on, post, echo, get, set, render, push, swap, wipe, pop, EventSubscription} from '../operator/Cargo.ts';
import {Node} from '../operator/BetterCargo.ts';
import {Input} from './UI.tsx';

type IWelcomeProps = {}

export function Welcome(props: IWelcomeProps) {
    const {} = props;

    const args = {
        node: 'WELCOME',
        initStyle: {
            width: '450px',
            height: 'auto',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderImage: 'linear-gradient(to bottom, transparent, #505050) 1',
            background: 'rbga(255, 255, 255, 0)',
            boxShadow: '0 4px 30px  rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(3.2px)',
            WebkitBackdropFilter: 'blur(3.2px)',
            display: 'flex',
            flexDirection: 'column'
        } as const,
        containers: [
            <WelcomeIdle></WelcomeIdle>,
            <WelcomeSettings></WelcomeSettings>
        ],
        initState: 0n
    };

    return (
        <RenderedRESTContainer {...args}></RenderedRESTContainer>
    );
}

export function WelcomeIdle() {
    const args = {
        node: 'WELCOME_IDLE',
        initStyle: {
            width: '100%',
            height: '100%',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '40px'
        } as const
    };

    const buttonsContainerArgs = {
        node: 'WELCOME_IDLE_BUTTON_CONTAINER',
        w: '100%',
        h: 'auto',
        initStyle: {
            gap: '30px'
        }
    };

    const buttonArgs0 = {
        node: 'WELCOME_IDLE_BUTTON_0',
        initText: 'Get Started'
    };

    const buttonArgs1 = {
        node: 'WELCOME_IDLE_BUTTON_1',
        initText: 'Learn More'
    };

    useEffect(function() {
        const subs: EventSubscription[] = [
            on({
                message: Message({node: 'WELCOME_IDLE_BUTTON_0', action: 'CLICKED'}),
                handler: function() {
                    post({
                        message: Message({node: 'WELCOME', prop: 'STATE', action: 'SET'}),
                        cargo: 1n
                    });
                }
            }),
            on({
                message: Message({node: 'WELCOME_IDLE_BUTTON_1', action: 'CLICKED'}),
                handler: function() {
                    const {open} = window as any;
    
                    open('https://dreamcatcher-1.gitbook.io/dreamcatcher');
                    return;
                }
            })
        ];

        return function() {
            const subsLength: number = subs.length;

            for (let i = 0; i < subsLength; i++) {
                const sub: EventSubscription = subs[i];
                sub.remove();
                return;
            }
        }
    }, []);

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
    const node = Node({address: 'WELCOME_SETTINGS'});

    const args = {
        node: 'WELCOME_SETTINGS',
        initStyle: {
            width: '100%',
            height: '100%',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '40px'
        } as const
    };

    const headingArgs = {
        node: 'WELCOME_SETTINGS_HEADING',
        initText: 'Settings',
        initStyle: {
            fontSize: '2em',
            background: '#615FFF'
        }
    };

    const inputArgs0 = {
        node: 'WELCOME_SETTINGS_INPUT_0',
        placeholder: 'Dreamcatcher Capital'
    };

    const inputArgs1 = {
        node: 'WELCOME_SETTINGS_INPUT_0',
        placeholder: 'Dream Token'
    };

    const inputArgs2 = {
        node: 'WELCOME_SETTINGS_INPUT_1',
        placeholder: 'vDREAM'
    };

    const buttonsContainerArgs = {
        node: 'WELCOME_SETTINGS_BUTTON_CONTAINER',
        w: '100%',
        h: 'auto',
        initStyle: {
            gap: '30px'
        }
    };

    const buttonArgs0 = {
        node: 'WELCOME_SETTINGS_BUTTON_0',
        initText: 'Next'
    };

    const buttonArgs1 = {
        node: 'WELCOME_SETTINGS_BUTTON_1',
        initText: 'Back'
    };

    useEffect(function() {
        const sub0 = on({
            message: Message({
                node: 'WELCOME_SETTINGS_BUTTON_0',
                action: 'CLICKED'
            }),
            handler: async function() {
                const isOkForPhase2 = await node.call({
                    address: 'VAULT_DEPLOYMENT',
                    signature: 'IS_OK_FOR_PHASE_2'
                }) as any[]

                console.log(isOkForPhase2[0])

                if (isOkForPhase2[0]) {
                    post({
                        message: Message({
                            node: 'WELCOME',
                            prop: 'STATE',
                            action: 'SET'
                        }),
                        cargo: 2n
                    });
                }
            }
        });

        const sub1 = on({
            message: Message({
                node: 'WELCOME_SETTINGS_BUTTON_1',
                action: 'CLICKED'
            }),
            handler: function() {

                post({
                    message: Message({
                        node: 'WELCOME',
                        prop: 'STATE',
                        action: 'SET'
                    }),
                    cargo: 0n
                });
            }
        })

        return function() {
            sub0.remove();
            sub1.remove();
            return;
        }
    }, []);

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