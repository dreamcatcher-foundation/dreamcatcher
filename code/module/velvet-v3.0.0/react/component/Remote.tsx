import type {CSSProperties} from "react";
import type {SpringConfig} from "react-spring";
import type {EventSubscription} from "fbemitter";
import type {ComponentPropsWithoutRef} from "react";
import type {ReactNode} from "react";
import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import {animated} from "react-spring";
import {useSpring} from "react-spring";
import {config} from "react-spring";
import {defaultEventsHub} from "../../event/hub/DefaultEventsHub.ts";

export type RemoteProps = ComponentPropsWithoutRef<"div"> & {
    remoteId: string;
    spring?: CSSProperties;
    springConfig?: SpringConfig;
    mountDelay?: bigint;
    mountCooldown?: bigint;
};

export default function Remote(props: RemoteProps): ReactNode {
    const {
        remoteId,
        className,
        spring,
        springConfig,
        style,
        children,
        mountDelay,
        mountCooldown,
        ...more
    } = props;
    const [springState, setSpringState] = useState<CSSProperties[]>([{}, spring ?? {}]);
    const [styleState, setStyleState] = useState<CSSProperties>(style ?? {});
    const [classNameState, setClassNameState] = useState<string>(className ?? "");
    const [onScreen, setOnScreen] = useState<ReactNode[]>([]);
    useEffect(function() {
        const subscriptions: EventSubscription[] = [
            defaultEventsHub.hook(remoteId, "renderRemoteSpring", (spring: CSSProperties) => setSpringState(oldSpring => [oldSpring[1], {...oldSpring[1], ...spring ?? {}}])),
            defaultEventsHub.hook(remoteId, "renderRemoteStyle", (style: CSSProperties) => setStyleState(oldStyle => ({...oldStyle, ...style ?? {}}))),
            defaultEventsHub.hook(remoteId, "renderRemoteClassName", (className: string) => setClassNameState(className)),
            defaultEventsHub.hook(remoteId, "pushRemoteContainer", function(component: ReactNode) {
                const components: ReactNode[] = onScreen;
                components.push(component);
                setOnScreen([...components]);
                return;
            }),
            defaultEventsHub.hook(remoteId, "pullRemoteContainer", function() {
                const components: ReactNode[] = onScreen;
                components.pop();
                setOnScreen([...components]);
                return;
            }),
            defaultEventsHub.hook(remoteId, "wipeRemoteContainer", function() {
                const components: ReactNode[] = onScreen;
                if (components.length == 0) {
                    return;
                }
                for (let i = 0; i < components.length; i++) {
                    const componentsNow: ReactNode[] = onScreen;
                    componentsNow.pop();
                    setOnScreen([...componentsNow]);
                }
                return;
            }),
            defaultEventsHub.hook(remoteId, "swapRemoteContainer", function(component: ReactNode) {
                const components: ReactNode[] = onScreen;
                components.pop();
                components.push(component);
                setOnScreen([...components]);
                return;
            })
        ];
        setTimeout(function() {
            if (Array.isArray(children)) {
                let cooldown: number = 0;
                children.forEach(function(child) {
                    if (child) {
                        setTimeout(function() {
                            const components: ReactNode[] = onScreen;
                            components.push(child);
                            setOnScreen([...components]);
                        }, cooldown);
                        cooldown += Number(mountCooldown);
                    }
                })
            }
            else {
                if (children) {
                    const components: ReactNode[] = onScreen;
                    components.push(children);
                    setOnScreen([...components]);
                }
            }
            return;
        }, Number(mountDelay));
        return function() {
            return subscriptions.forEach(subscription => subscription.remove());
        }
    }, []);
    return <animated.div {...{
        "className": classNameState,
        "style": {
            ...useSpring({
                "from": springState[0],
                "to": springState[1],
                "config": springConfig ?? config.default
            }),
            ...styleState
        },
        "children": onScreen,
        ...more
    }}/>;
}