import {type ReactNode, type CSSProperties, type ComponentPropsWithoutRef, useState, useEffect} from "react";
import {type SpringConfig, animated, config, useSpring} from "react-spring";
import {type EventSubscription} from "fbemitter";
import {defaultMappedEventEmitter} from "../lib/messenger/DefaultMappedEventEmitter.ts";

export type BaseProps = ComponentPropsWithoutRef<"div"> & {
    name: string;
    spring?: CSSProperties;
    springConfig?: SpringConfig;
    mountDelay?: bigint;
    mountCooldown?: bigint;
}

export default function Base(props: BaseProps): ReactNode {
    const {name, className: pClassName, style: pStyle, spring: pSpring, springConfig: pSpringConfig, mountDelay, mountCooldown, children, ...more} = props;
    const [spring, setSpring] = useState<CSSProperties[]>([{}, pSpring ?? {}]);
    const [springConfig, setSpringConfig] = useState<SpringConfig>(pSpringConfig ?? config.default);
    const [style, setStyle] = useState<CSSProperties>(pStyle ?? {});
    const [className, setClassName] = useState<string>(pClassName ?? "");
    const [onScreen, setOnScreen] = useState<ReactNode[]>([]);
    useEffect(function() {
        const subscriptions: EventSubscription[] = [
            defaultMappedEventEmitter.hook(name, "setSpring", (spring: CSSProperties) => setSpring(oldSpring => [oldSpring[1], {...oldSpring[1], ...spring}])),
            defaultMappedEventEmitter.hook(name, "setSpringConfig", (springConfig: SpringConfig) => setSpringConfig(springConfig)),
            defaultMappedEventEmitter.hook(name, "setStyle", (style: CSSProperties) => setStyle(oldStyle => ({...oldStyle, ...style}))),
            defaultMappedEventEmitter.hook(name, "setClassName", (className: string) => setClassName(className)),
            defaultMappedEventEmitter.hook(name, "push", function(component: ReactNode) {
                const components: ReactNode[] = onScreen;
                components.push(component);
                setOnScreen([...components]);
                return;
            }),
            defaultMappedEventEmitter.hook(name, "pull", function() {
                const components: ReactNode[] = onScreen;
                components.pop();
                setOnScreen([...components]);
                return;
            }),
            defaultMappedEventEmitter.hook(name, "wipe", function() {
                const components: ReactNode[] = onScreen;
                if (components.length == 0) {
                    return;
                }
                for (let i = 0; i < components.length; i++) {
                    const currentComponents: ReactNode[] = onScreen;
                    currentComponents.pop();
                    setOnScreen([...currentComponents]);
                }
                return;
            }),
            defaultMappedEventEmitter.hook(name, "swap", function(component: ReactNode) {
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
                            return;
                        }, cooldown);
                        cooldown += Number(mountCooldown ?? 0n);
                    }
                });
            }
            else {
                if (children) {
                    const components: ReactNode[] = onScreen;
                    components.push(children);
                    setOnScreen([...components]);
                }
            }
        }, Number(mountDelay ?? 0n));
        return function() {
            return subscriptions.forEach(subscription => subscription.remove());
        }
    }, []);
    return (
        <animated.div {...{
            className: className,
            style: {
                ...useSpring({from: spring[0], to: spring[1], config: springConfig}),
                ...style
            },
            children: onScreen,
            ...more
        }}>
        </animated.div>
    )
}