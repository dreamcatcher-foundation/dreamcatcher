import type { ReactNode } from "@HarukaToolkitBundle";
import type { CSSProperties } from "@HarukaToolkitBundle";
import type { ComponentPropsWithoutRef } from "@HarukaToolkitBundle";
import type { SpringConfig } from "@HarukaToolkitBundle";
import type { EventSubscription } from "@HarukaToolkitBundle";
import { useState } from "@HarukaToolkitBundle";
import { useEffect } from "@HarukaToolkitBundle";
import { animated } from "@HarukaToolkitBundle";
import { config } from "@HarukaToolkitBundle";
import { useSpring } from "@HarukaToolkitBundle";
import { stream } from "@HarukaToolkitBundle";
import React from "react";

interface IHookProps extends ComponentPropsWithoutRef<`div`> {
    nodeName: string;
    spring?: CSSProperties;
    springConfig?: SpringConfig;
    childrenMountDelay?: bigint;
    childrenMountCooldown?: bigint;
}

function Hook(_props: IHookProps): ReactNode {
    const {nodeName, className: classNameProp, style: styleProp, spring: springProp, springConfig: springConfigProp, childrenMountDelay, childrenMountCooldown, children, ...more} = _props;
    const [className, setClassName] = useState<string>(classNameProp ?? "");
    const [style, setStyle] = useState<CSSProperties>(styleProp ?? {});
    const [spring, setSpring] = useState<CSSProperties[]>([{}, springProp ?? {}]);
    const [springConfig, setSpringConfig] = useState<SpringConfig>(springConfigProp ?? config.default);
    const [mounted, setMounted] = useState<ReactNode[]>([]);
    useEffect(function() {
        const subscriptions: EventSubscription[] = [
            stream().createCommand({atNodeName: nodeName, commandName: "setSpring", hook: (spring: CSSProperties) => setSpring(oldSpring => [oldSpring[1], {...oldSpring[1], ...spring}])}),
            stream().createCommand({atNodeName: nodeName, commandName: "setSpringConfig", hook: (springConfig: SpringConfig) => setSpringConfig(springConfig)}),
            stream().createCommand({atNodeName: nodeName, commandName: "setStyle", hook: (style: CSSProperties) => setStyle(oldStyle => ({...oldStyle, ...style}))}),
            stream().createCommand({atNodeName: nodeName, commandName: "setClassName", hook: (className: string) => setClassName(className)}),
            stream().createCommand({atNodeName: nodeName, commandName: "push", hook: (component: ReactNode) => setMounted(currentComponents => [...currentComponents, component])}),
            stream().createCommand({atNodeName: nodeName, commandName: "pull", hook: () => setMounted(currentComponents => currentComponents.slice(0, -1))}),
            stream().createCommand({atNodeName: nodeName, commandName: "wipe", hook: () => setMounted([])}),
            stream().createCommand({atNodeName: nodeName, commandName: "swap", hook: (component: ReactNode) => setMounted(currentComponents => [...currentComponents.slice(0, -1), component])})
        ];
        setTimeout(function() {
            if (!children) {
                return;
            }
            if (Array.isArray(children)) {
                let cooldown: number = 0;
                (children as (ReactNode | undefined)[]).forEach(child => {
                    if (!child) {
                        return;
                    }
                    setTimeout(() => setMounted(components => [...components, child]), cooldown);
                    cooldown += Number(childrenMountCooldown);
                    return;
                });
                return;
            }
            setMounted(components => [...components, children]);
        }, Number(childrenMountDelay));
        return () => subscriptions.forEach(subscription => subscription.remove());
    }, []);
    return (
        <animated.div
        className={className}
        style={{
            ...useSpring({from: spring[0], to: spring[1], config: springConfig}),
            ...style
        }}
        children={mounted}
        {...more}>
        </animated.div>
    );
}

export type { IHookProps };
export { Hook };