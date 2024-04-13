import type {CSSProperties} from 'react';
import type {EventSubscription} from "../operator/Cargo.ts";
import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {animated, useSpring, config} from 'react-spring';
import {on, post, render, push, swap, pull, wipe, cleanup} from '../operator/Cargo.ts';

export type IRenderedProps = ({
    nodeId: string;
    initialClassName?: string;
    initialSpring?: object;
    initialSpringConfig?: object;
    initialStyle?: CSSProperties;
    [k: string]: any;
});

export function Rendered(props: IRenderedProps) {
    const {nodeId, initialClassName, initialSpring, initialSpringConfig, initialStyle, ...more} = props;

    const [spring, setSpring] = useState<object[]>([({}), ({})]);
    const [style, setStyle] = useState<CSSProperties>(({}));
    const [className, setClassName] = useState<string>(initialClassName ?? "");

    useEffect(function() {
        const subs: EventSubscription[] = ([
            on({
                recipient: nodeId,
                message: "SpringRequest",
                handler: () => spring
            }),
            on({
                recipient: nodeId,
                message: "StyleRequest",
                handler: () => style
            }),
            on({
                recipient: nodeId,
                message: "ClassNameRequest",
                handler: () => className
            }),
            on({
                recipient: nodeId,
                message: "RenderSpringRequest",
                handler: (spring: object) => setSpring(oldSpring => [oldSpring[1], ({...oldSpring[1], ...spring ?? ({})})])
            }),
            on({
                recipient: nodeId,
                message: "RenderStyleRequest",
                handler: (style: CSSProperties) => setStyle(oldStyle => ({...oldStyle, ...style ?? ({})}))
            }),
            on({
                recipient: nodeId,
                message: "RenderClassNameRequest",
                handler: (className: string) => setClassName(className ?? "")
            })
        ]);

        render({
            recipient: nodeId,
            spring: initialSpring ?? ({}),
            style: initialStyle ?? ({})
        });

        return cleanup(subs);
    }, []);

    const args = ({
        className: className,
        style: ({
            ...useSpring({from: spring[0], to: spring[1], config: initialSpringConfig ?? config.default}),
            ...style
        }),
        ...more
    }) as const;

    return (<animated.div {...args}></animated.div>);
}

export type IRenderedContainerProps = ({
    nodeId: string;
    initialClassName?: string;
    initialSpring?: object;
    initialSpringConfig?: object;
    initialStyle?: CSSProperties;
    childrenMountDelay?: bigint;
    childrenMountCooldown?: bigint;
    children?: React.JSX.Element | (React.JSX.Element)[];
    [k: string]: any;
});

export function RenderedContainer(props: IRenderedContainerProps) {
    const {nodeId, initialClassName, initialSpring, initialSpringConfig, initialStyle, childrenMountDelay, childrenMountCooldown, children, ...more} = props;

    const [onScreen, setOnScreen] = useState<(React.JSX.Element)[]>([]);

    useEffect(function() {
        const {isArray} = Array;
        const numChildrenMountDelay: number = Number(childrenMountDelay) ?? 0;
        const numChildrenMountCooldown: number = Number(childrenMountCooldown) ?? 0;

        setTimeout(function() {
            if (isArray(children)) {
                const length: number = children.length;
                let cooldown: number = 0;

                for (let i = 0; i < length; i++) {
                    const child: React.JSX.Element = children[i];

                    if (child) {
                        setTimeout(function() {
                            const components: (React.JSX.Element)[] = onScreen;
                            components.push(child);
                            setOnScreen([...components]);
                        }, cooldown);

                        cooldown += numChildrenMountCooldown;
                    }
                }
            }

            else {
                if (children) {
                    const components: (React.JSX.Element)[] = onScreen;
                    components.push(children);
                    setOnScreen([...components]);
                }
            }
        }, numChildrenMountDelay);

        const subs: EventSubscription[] = ([
            on({
                recipient: nodeId,
                message: "PushRequest",
                handler: function(component: React.JSX.Element) {
                    let components: (React.JSX.Element)[] = onScreen;
                    components.push(component);
                    setOnScreen([...components]);
                    return;
                }
            }),
            on({
                recipient: nodeId,
                message: "PullRequest",
                handler: function() {
                    let components: (React.JSX.Element)[] = onScreen;
                    components.pop();
                    setOnScreen([...components]);
                    return;
                }
            }),
            on({
                recipient: nodeId,
                message: "WipeRequest",
                handler: function() {
                    let components: (React.JSX.Element)[] = onScreen;
                    let componentsLength: number = components.length;

                    if (componentsLength === 0) {
                        return;
                    }
                    
                    for (let i = 0; i < componentsLength; i++) {
                        let componentsNow: (React.JSX.Element)[] = onScreen;
                        componentsNow.pop();
                        setOnScreen([...componentsNow]);
                    }

                    return;
                }
            })
        ]);

        return cleanup(subs);
    }, []);

    const args = ({
        nodeId: nodeId,
        initialClassName: initialClassName,
        initialSpring: initialSpring,
        initialSpringConfig: initialSpringConfig,
        initialStyle: initialStyle,
        children: onScreen,
        ...more
    }) as const;

    return (<Rendered {...args}></Rendered>);
}

export type IRenderedCol = ({
    nodeId: string;
    initialClassName?: string;
    initialSpring?: object;
    initialSpringConfig?: object;
    initialStyle?: CSSProperties;
    childrenMountDelay?: bigint;
    childrenMountCooldown?: bigint;
    children?: React.JSX.Element | (React.JSX.Element)[];
    w: string;
    h: string;
    bg?: string;
    [k: string]: any;
});

export function RenderedCol(props: IRenderedCol) {
    const {nodeId, initialClassName, initialSpring, initialSpringConfig, initialStyle, childrenMountDelay, childrenMountCooldown, children, w, h, bg, ...more} = props;

    const args = ({
        nodeId: nodeId,
        initialClassName: initialClassName,
        initialSpring: initialSpring,
        initialSpringConfig: initialSpringConfig,
        initialStyle: ({
            width: w,
            height: h,
            background: bg ?? "transparent",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            ...initialStyle ?? ({})
        }),
        childrenMountDelay: childrenMountDelay,
        childrenMountCooldown: childrenMountCooldown,
        children: children,
        ...more
    }) as const;

    return (<RenderedContainer {...args}></RenderedContainer>);
}

export function RenderedRow(props: IRenderedCol) {
    const {nodeId, initialClassName, initialSpring, initialSpringConfig, initialStyle, childrenMountDelay, childrenMountCooldown, children, w, h, bg, ...more} = props;

    const args = ({
        nodeId: nodeId,
        initialClassName: initialClassName,
        initialSpring: initialSpring,
        initialSpringConfig: initialSpringConfig,
        w: w,
        h: h,
        bg: bg,
        initialStyle: ({
            flexDirection: "row",
            ...initialStyle ?? ({})
        }),
        childrenMountDelay: childrenMountDelay,
        childrenMountCooldown: childrenMountCooldown,
        children: children,
        ...more
    }) as const;

    return (<RenderedCol {...args}></RenderedCol>);
}


export type IRenderedTextProps = ({
    nodeId: string;
    initialClassName?: string;
    initialSpring?: object;
    initialSpringConfig?: object;
    initialStyle?: CSSProperties;
    initialText?: string;
    [k: string]: any;
});

export function RenderedText(props: IRenderedTextProps) {
    const {nodeId, initialClassName, initialSpring, initialSpringConfig, initialStyle, initialText, ...more} = props;

    const [text, setText] = useState<string>("");

    useEffect(function() {
        const subs: EventSubscription[] = ([
            on({
                recipient: nodeId,
                message: "TextRequest",
                handler: () => text
            }),
            on({
                recipient: nodeId,
                message: "RenderTextRequest",
                handler: (text: string) => setText(text ?? "")
            })
        ]);

        render({
            recipient: nodeId,
            text: initialText ?? ""
        });

        return cleanup(subs);
    }, []);

    const args = ({
        nodeId: nodeId,
        initialClassName: initialClassName,
        initialSpring: initialSpring,
        initialSpringConfig: initialSpringConfig,
        initialStyle: ({
            fontSize: "8px",
            fontFamily: "roboto mono",
            fontWeight: "bold",
            color: "white",
            background: "#D6D5D4",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            ...initialStyle ?? ({})
        }),
        ...more
    }) as const;

    return (<Rendered {...args}>{text}</Rendered>);
}

export type IRenderedRESTContainer = ({
    nodeId: string;
    initialClassName?: string;
    initialSpring?: object;
    initialSpringConfig?: object;
    initialStyle?: CSSProperties;
    initialState?: bigint;
    containersMountDelay?: bigint;
    containersMountCooldown?: bigint;
    containers: (React.JSX.Element)[];
    [k: string]: any;
});

export function RenderedRESTContainer(props: IRenderedRESTContainer) {
    const {nodeId, initialClassName, initialSpring, initialSpringConfig, initialStyle, initialState, containersMountDelay, containersMountCooldown, containers, ...more} = props;

    useEffect(function() {
        const subs: EventSubscription[] = ([
            on({
                recipient: nodeId,
                message: "RenderStateRequest",
                handler: function(state: bigint) {
                    const numDelay: number = 25;
                    const numState: number = Number(state ?? 0);

                    wipe({recipient: nodeId});

                    setTimeout(function() {
                        const container: React.JSX.Element = containers[numState];

                        push({
                            recipient: nodeId,
                            component: container
                        });

                        return;
                    }, numDelay);

                    return;
                }
            })
        ]);

        const numInitialState: number = Number(initialState ?? 0);
        const firstContainer: React.JSX.Element = containers[numInitialState];

        push({
            recipient: nodeId,
            component: firstContainer
        });

        return cleanup(subs);
    }, []);

    const args = ({
        nodeId: nodeId,
        initialClassName: initialClassName,
        initialSpring: initialSpring,
        initialSpringConfig: initialSpringConfig,
        initialStyle: initialStyle,
        childrenMountDelay: containersMountDelay,
        childrenMountCooldown: containersMountCooldown,
        ...more
    }) as const;

    return (<RenderedContainer {...args}></RenderedContainer>);
}

export type IRenderedButtonProps = ({
    nodeId: string;
    initialClassName?: string;
    initialSpring?: object;
    initialSpringConfig?: object;
    initialStyle?: CSSProperties;
    initialText?: string;
    [k: string]: any;
});

export function RenderedButton0(props: IRenderedButtonProps) {
    const {nodeId, initialClassName, initialSpring, initialSpringConfig, initialStyle, initialText, ...more} = props;

    const args = ({
        nodeId: nodeId,
        initialClassName: initialClassName,
        initialSpring: ({
            background: "#615FFF",
            boxShadow: "0px 0px 32px 2px #615FFF",
            ...initialSpring ?? ({})
        }),
        initialStyle: ({
            width: "200px",
            height: "50px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            ...initialStyle ?? ({})
        }),
        onMouseEnter: () => render({
            recipient: nodeId,
            spring: ({
                background: "#6C69FF",
                boxShadow: "0px 0px 32px 8px #6C69FF",
                cursor: "pointer"
            })
        }),
        onMouseLeave: () => render({
            recipient: nodeId,
            spring: ({
                background: "#615FFF",
                boxShadow: "0px 0px 32px 2px #615FFF",
                cursor: "auto"
            })
        }),
        onClick: () => post({
            sender: nodeId,
            message: "clicked"
        }),
        ...more
    }) as const;

    const textArgs = ({
        nodeId: `${nodeId}Label`,
        initialText: initialText,
        initialStyle: ({
            fontSize: "15px",
            background: "#171717"
        })
    }) as const;

    return (
        <Rendered {...args}>
            <RenderedText {...textArgs}></RenderedText>
        </Rendered>
    );
}

export function RenderedButton1(props: IRenderedButtonProps) {
    const {nodeId, initialClassName, initialSpring, initialSpringConfig, initialStyle, initialText, ...more} = props;

    const args = ({
        nodeId: nodeId,
        initialClassName: initialClassName,
        initialSpring: ({
            background: "#171717",
            boxShadow: "0px 0px 32px 2px #615FFF",
            borderColor: "#615FFF",
            ...initialSpring ?? ({})
        }),
        initialStyle: ({
            width: "200px",
            height: "50px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderStyle: "solid",
            borderWidth: "1px",
            ...initialStyle ?? ({})
        }),
        onMouseEnter: () => render({
            recipient: nodeId,
            spring: ({
                boxShadow: "0px 0px 32px 8px #6C69FF",
                borderColor: "#6C69FF",
                cursor: "pointer"
            })
        }),
        onMouseLeave: () => render({
            recipient: nodeId,
            spring: ({
                boxShadow: "0px 0px 32px 2px #615FFF",
                borderColor: "#615FFF",
                cursor: "auto"
            })
        }),
        onClick: () => post({
            sender: nodeId,
            message: "Click"
        }),
        ...more
    }) as const;

    const textArgs = ({
        nodeId: `${nodeId}Label`,
        initialText: initialText,
        initialStyle: ({
            fontSize: "15px"
        })
    }) as const;

    return (
        <Rendered {...args}>
            <RenderedText {...textArgs}></RenderedText>
        </Rendered>
    );
}