import {stream} from "../../../core/Stream.tsx";
import React, {type CSSProperties, useEffect, useState} from "react";
import {type SpringProps, animated, useSpring} from "react-spring";

interface RemoteBaseProps {
    [key: string]: any;
    children?: JSX.Element | (JSX.Element)[];
}

interface RemoteStreamableProps {
    tag: string;
    spring?: SpringProps;
    style?: CSSProperties;
    classname?: string;
}

interface RemoteIntroAndOutroProps {
    introAnimationClassname?: string;
    outroAnimationClassname?: string;
    tags?: string[];
}

interface RemotePopProps {
    isPopper?: boolean;
    delay?: number;
    cooldown?: number;
    repeat?: boolean;
    repeatInterval?: number;
    flexDirection?: string;
}

interface RemoteProps extends 
    RemoteBaseProps, 
    RemoteStreamableProps,
    RemoteIntroAndOutroProps,
    RemotePopProps {}

export default function Remote(props: RemoteProps) {
    /// Props
    let {children, ...more} = props;
    let {tag, spring, style, classname} = props;
    let {introAnimationClassname, outroAnimationClassname, tags} = props;
    let {isPopper, delay, cooldown, repeat, flexDirection, repeatInterval} = props;
    flexDirection = flexDirection ?? "column";
    spring = spring ?? {};
    style = style ?? {};
    style = {
        display: "flex",
        flexDirection: flexDirection,
        justifyContext: "center",
        alignItems: "center",
        ...style
    } as any;
    classname = classname ?? "";
    introAnimationClassname = introAnimationClassname ?? "";
    outroAnimationClassname = outroAnimationClassname ?? "";
    tags = tags ?? [];
    isPopper = isPopper ?? false;
    delay = delay ?? 0;
    cooldown = cooldown ?? 0;
    repeat = repeat ?? false;
    repeatInterval = repeatInterval ?? 0;

    /// State
    const [mySpring, setMySpring] = useState([{}, {}]);
    const [myStyle, setMyStyle] = useState({});
    const [myClassname, setMyClassname] = useState(classname);

    /// Remote Streamable DOM
    useEffect(function() {
        /// Events
        const renderSpringEvent = `${tag} render spring`;
        const renderStyleEvent = `${tag} render style`;
        const getSpringEvent = `${tag} get spring`;
        const getStyleEvent = `${tag} get style`;
        const setClassnameEvent = `${tag} set classname`;

        /// Handlers
        function handleRenderSpringEvent(to: SpringProps) {
            return setMySpring(springNow => [springNow[1], {
                ...springNow[1],
                ...to
            }]);
        }

        function handleRenderStyleEvent(to: CSSProperties) {
            return setMyStyle(styleNow => ({
                ...styleNow,
                ...to
            }));
        }

        function handleGetSpringEvent() {
            return stream.post({event: `${tag} spring`, data: mySpring});
        }

        function handleGetStyleEvent() {
            return stream.post({event: `${tag} style`, data: myStyle});
        }

        function handleSetClassnameEvent(classname: string) {
            setMyClassname(classname);
        }

        /// Subscriptions
        stream.subscribe({event: renderSpringEvent, task: handleRenderSpringEvent});
        stream.subscribe({event: renderStyleEvent, task: handleRenderStyleEvent});
        stream.subscribe({event: getSpringEvent, task: handleGetSpringEvent});
        stream.subscribe({event: getStyleEvent, task: handleGetStyleEvent});
        stream.subscribe({event: setClassnameEvent, task: handleSetClassnameEvent});

        /// Initial Spring & Style
        stream.renderSpring({tag: tag, spring: spring});
        stream.renderStyle({tag: tag, style: style!});

        function cleanup() {
            stream.wipe({event: renderSpringEvent});
            stream.wipe({event: renderStyleEvent});
            stream.wipe({event: getSpringEvent});
            stream.wipe({event: getStyleEvent});
            stream.wipe({event: setClassnameEvent});
        }

        return cleanup;
    }, []);

    /// Remote Children
    const [onScreen, setOnScreen] = useState(Array.isArray(children) ? [] as (JSX.Element)[] : [children]);

    const [popped, setPopped] = useState([] as number[]);

    useEffect(function() {
        /// Events
        const pushBelowEvent = `${tag} pushBelow`;
        const pushAboveLastItemEvent = `${tag} pushAboveLastItem`;
        const pushAboveEvent = `${tag} pushAbove`;
        const pushBetweenEvent = `${tag} pushBetween`;
        const pullBelowEvent = `${tag} pullBelow`;
        const pullAboveEvent = `${tag} pullAbove`;
        const pullEvent = `${tag} pull`;
        const wipeEvent = `${tag} wipe`;

        /// Handlers
        function handlePushBelowEvent(item: JSX.Element) {
            const items = onScreen;
            items.push(item);
            setOnScreen([...items]);
        }

        function handlePushAboveLastItemEvent(item: JSX.Element) {}

        function handlePushAboveEvent(item: JSX.Element) {}

        function handlePushBetweenEvent(item: JSX.Element) {}

        function handlePullBelowEvent() {
            const items = onScreen;
            items.pop();
            setOnScreen([...items]);
        }

        function handlePullAboveEvent() {
            const items = onScreen;
            items.shift();
            setOnScreen([...items]);
        }

        function handlePullEvent(position: number) {
            const items = onScreen;
            items.splice(position, 1);
            setOnScreen([...items]);
        }

        function handleWipeEvent() {
            const itemsLength = onScreen.length;
            for (let i = 0; i < itemsLength; i++) {
                const items = onScreen;
                items.pop();
                setOnScreen([...items]);
            }
        }

        /// Subscriptions
        stream.subscribe({event: pushBelowEvent, task: handlePushBelowEvent});
        stream.subscribe({event: pushAboveLastItemEvent, task: handlePushAboveLastItemEvent});
        stream.subscribe({event: pushAboveEvent, task: handlePushAboveEvent});
        stream.subscribe({event: pushBetweenEvent, task: handlePushBetweenEvent});
        stream.subscribe({event: pullBelowEvent, task: handlePullBelowEvent});
        stream.subscribe({event: pullAboveEvent, task: handlePullAboveEvent});
        stream.subscribe({event: pullEvent, task: handlePullEvent});
        stream.subscribe({event: wipeEvent, task: handleWipeEvent});
    
        /// Pop
        if (isPopper && children) {
            setTimeout(function() {

                function hasPopped(position: number) {
                    return popped.includes(position);
                }

                function markAsPopped(position: number) {
                    const items = popped;
                    items.push(position);
                    setPopped([...items]);
                }

                switch (repeat) {
                    case true:
                        setInterval(function() {
                            setPopped([...[]]);
                            const childrenLength = (children as any).length;
                            let wait = cooldown;
                            for (let i = 0; i < childrenLength; i++) {
                                if (!hasPopped(i)) {
                                    const child = (children as any)[i] as JSX.Element;
                                    const childTag = tags[i];
                                    setTimeout(function() {
                                        stream.post({event: `${tag} pushBelow`, data: child});
                                        
                                        /// Immidietly after being pushed, appends the intro animation to the child
                                        if (introAnimationClassname) {
                                            setTimeout(function() {
                                                stream.post({event: `${childTag} set classname`, data: introAnimationClassname});
                                            }, 0.005);
                                        }
                                    }, wait);
                                    wait += cooldown!;
                                    markAsPopped(i);
                                }
                            }             
                        }, repeatInterval)
                        break;
                    default:
                        const childrenLength = (children as any).length;
                        let wait = cooldown;
                        for (let i = 0; i < childrenLength; i++) {
                            if (!hasPopped(i)) {
                                const child = (children as any)[i] as JSX.Element;
                                const childTag = tags[i];
                                setTimeout(function() {
                                    stream.post({event: `${tag} pushBelow`, data: child});
                                    
                                    /// Immidietly after being pushed, appends the intro animation to the child
                                    if (introAnimationClassname) {
                                        setTimeout(function() {
                                            stream.post({event: `${childTag} set classname`, data: introAnimationClassname});
                                        }, 0.005);
                                    }
                                }, wait);
                                wait += cooldown!;
                                markAsPopped(i);
                            }
                        }
                        break;
                }                
            }, delay);
        }

        function cleanup() {
            stream.wipe({event: pushBelowEvent});
            stream.wipe({event: pushAboveLastItemEvent});
            stream.wipe({event: pushAboveEvent});
            stream.wipe({event: pushBetweenEvent});
            stream.wipe({event: pullBelowEvent});
            stream.wipe({event: pullAboveEvent});
            stream.wipe({event: pullEvent});
            stream.wipe({event: wipeEvent});
        }

        return cleanup;
    }, []);

    return <animated.div
        className={myClassname}
        style={{
            ...useSpring({
                from: mySpring[0],
                to: mySpring[1]
            }),
            ...myStyle
        }}
        {...more}
        children={onScreen}/>
}