import { type ReactNode } from "react";
import { type CSSProperties } from "react";
import { type ComponentPropsWithoutRef } from "react";
import { type SpringConfig } from "react-spring";
import { useState } from "react";
import { useEffect } from "react";
import { animated } from "react-spring";
import { config } from "react-spring";
import { useSpring } from "react-spring";
import { Stream } from "@atlas/shared/com/Stream.ts";
import { EventSubscription } from "fbemitter";

interface IHookProps extends ComponentPropsWithoutRef<"div"> {
    node: string;
    spring?: CSSProperties;
    springConfig?: SpringConfig;
    childrenMountDelay?: bigint;
    childrenMountCooldown?: bigint;
}

function Hook(props: IHookProps): ReactNode {
    let {
        node, 
        className: classNameProp, 
        style: styleProp, 
        spring: springProp, 
        springConfig: springConfigProp, 
        childrenMountDelay, 
        childrenMountCooldown, 
        children, 
        ...more
    } = props;
    let [className, setClassName] = useState<string>(classNameProp ?? "");
    let [style, setStyle] = useState<CSSProperties>(styleProp ?? {});
    let [spring, setSpring] = useState<CSSProperties[]>([{}, springProp ?? {}]);
    let [springConfig, setSpringConfig] = useState<SpringConfig>(springConfigProp ?? config.default);
    let [mounted, setMounted] = useState<ReactNode[]>([]);
    useEffect(function() {
        // WARNING Commands are not typesafe, if a wrong type is
        //         passed to these methods, bugs and errors will
        //         occur.
        let subscriptions: EventSubscription[] = [
            Stream.createSubscription({atNode: node, command: "setSpring", hook: (spring: CSSProperties) => setSpring(oldSpring => [oldSpring[1], {...oldSpring[1], ...spring}])}),
            Stream.createSubscription({atNode: node, command: "setSpringConfig", hook: (springConfig: SpringConfig) => setSpringConfig(springConfig)}),
            Stream.createSubscription({atNode: node, command: "setStyle", hook: (style: CSSProperties) => setStyle(oldStyle => ({...oldStyle, ...style}))}),
            Stream.createSubscription({atNode: node, command: "setClassName", hook: (className: string) => setClassName(className)}),
            Stream.createSubscription({atNode: node, command: "push", hook: (component: ReactNode) => setMounted(currentComponents => [...currentComponents, component])}),
            Stream.createSubscription({atNode: node, command: "pull", hook: () => setMounted(currentComponents => currentComponents.slice(0, -1))}),
            Stream.createSubscription({atNode: node, command: "wipe", hook: () => setMounted([])}),
            Stream.createSubscription({atNode: node, command: "swap", hook: (component: ReactNode) => setMounted(currentComponents => [...currentComponents.slice(0, -1), component])})
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

export { type IHookProps };
export { Hook };