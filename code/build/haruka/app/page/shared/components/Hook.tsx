import React, {type ReactNode, type CSSProperties, type ComponentPropsWithoutRef, useState, useEffect} from "react";
import {type SpringConfig, animated, config, useSpring} from "react-spring";
import {type EventSubscription} from "fbemitter";
import {defaultMappedEventEmitter} from "../../../library/event-driven-architecture/DefaultMappedEventEmitter.ts";

export interface HookProps extends ComponentPropsWithoutRef<"div"> {
    uniqueId: string;
    spring?: CSSProperties;
    springConfig?: SpringConfig;
    childrenMountDelay?: bigint;
    childrenMountCooldown?: bigint;
}

export default function Hook(_props: HookProps): ReactNode {
    const {uniqueId, className: classNameProp, style: styleProp, spring: springProp, springConfig: springConfigProp, childrenMountDelay, childrenMountCooldown, children, ...more} = _props;
    const [className, setClassName] = useState<string>(classNameProp ?? "");
    const [style, setStyle] = useState<CSSProperties>(styleProp ?? {});
    const [spring, setSpring] = useState<CSSProperties[]>([{}, springProp ?? {}]);
    const [springConfig, setSpringConfig] = useState<SpringConfig>(springConfigProp ?? config.default);
    const [mounted, setMounted] = useState<ReactNode[]>([]);
    useEffect(function() {
        const childrenMountDelayAsNum: number = Number(childrenMountDelay ?? 0n);
        const childrenMountCooldownAsNum: number = Number(childrenMountCooldown ?? 0n);
        const subscriptions: EventSubscription[] = [
            defaultMappedEventEmitter.hook(uniqueId, "setSpring", (spring: CSSProperties) => setSpring(oldSpring => [oldSpring[1], {...oldSpring[1], ...spring}])),
            defaultMappedEventEmitter.hook(uniqueId, "setSpringConfig", (springConfig: SpringConfig) => setSpringConfig(springConfig)),
            defaultMappedEventEmitter.hook(uniqueId, "setStyle", (style: CSSProperties) => setStyle(oldStyle => ({...oldStyle, ...style}))),
            defaultMappedEventEmitter.hook(uniqueId, "setClassName", (className: string) => setClassName(className)),
            defaultMappedEventEmitter.hook(uniqueId, "push", (component: ReactNode) => setMounted(currentComponents => [...currentComponents, component])),
            defaultMappedEventEmitter.hook(uniqueId, "pull", () => setMounted(currentComponents => currentComponents.slice(0, -1))),
            defaultMappedEventEmitter.hook(uniqueId, "wipe", () => setMounted([])),
            defaultMappedEventEmitter.hook(uniqueId, "swap", (component: ReactNode) => setMounted(currentComponents => [...currentComponents.slice(0, -1), component]))
        ];
        setTimeout(function() {
            const hasChildren: boolean = !!children;
            const isAnArrayOfChildren: boolean = Array.isArray(children);
            if (!hasChildren) {
                return;
            }
            if (isAnArrayOfChildren) {
                const childrenAsArray: ReactNode[] = children as ReactNode[];
                let cooldown: number = 0;
                childrenAsArray.forEach(function(child: ReactNode) {
                    const isAnEmptyChild: boolean = !child;
                    if (isAnEmptyChild) {
                        return;
                    }
                    setTimeout(function() {
                        return setMounted(currentComponents => [...currentComponents, child]);
                    }, cooldown);
                    cooldown += childrenMountCooldownAsNum;
                    return;
                });
                return;
            }
            setMounted(currentComponents => [...currentComponents, children]);
        }, childrenMountDelayAsNum);
        return function() {
            return subscriptions.forEach(subscription => subscription.remove());
        }
    }, []);
    return (
        <animated.div
        className={className}
        style={{
            ...useSpring({from: spring[0], to: spring[1], config: springConfig}),
            ...style
        }}
        children={mounted}
        {...more}/>
    );
}