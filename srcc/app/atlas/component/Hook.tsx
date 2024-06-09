import * as ReactSpring from "react-spring";
import React from "react";
import { EventBus } from "../class/eventBus/EventBus.ts";

export interface IHookProps extends React.ComponentPropsWithoutRef<"div"> {
    node: string;
    spring?: React.CSSProperties;
    springConfig?: ReactSpring.SpringConfig;
    childrenMountDelay?: bigint;
    childrenMountCooldown?: bigint;
}

export function Hook(props: IHookProps): React.ReactNode {
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
    let [className, setClassName] = React.useState<string>(classNameProp ?? "");
    let [style, setStyle] = React.useState<React.CSSProperties>(styleProp ?? {});
    let [spring, setSpring] = React.useState<React.CSSProperties[]>([{}, springProp ?? {}]);
    let [springConfig, setSpringConfig] = React.useState<ReactSpring.SpringConfig>(springConfigProp ?? ReactSpring.config.default);
    let [mounted, setMounted] = React.useState<React.ReactNode[]>([]);
    React.useEffect(function() {
        const subscriptions: EventBus.ISubscription[] = [
            new EventBus.MessageSubscription({
                at: node,
                message: "setSpring",
                handler(item?: unknown): void {
                    if (!item) {
                        return;
                    }
                    // @unsafe
                    return setSpring(oldSpring => [oldSpring[1], {...oldSpring[1], ...(item as React.CSSProperties)}]);
                },
                once: false
            }),
            new EventBus.MessageSubscription({
                at: node,
                message: "setSpringConfig",
                handler(item?: unknown): void {
                    if (!item) {
                        return;
                    }
                    // @unsafe
                    return setSpringConfig((item as ReactSpring.SpringConfig));
                },
                once: false
            }),
            new EventBus.MessageSubscription({
                at: node,
                message: "setStyle",
                handler(item?: unknown): void {
                    if (!item) {
                        return;
                    }
                    // @unsafe
                    return setStyle(oldStyle => ({...oldStyle, ...(item as React.CSSProperties)}));
                },
                once: false
            }),
            new EventBus.MessageSubscription({
                at: node,
                message: "setClassName",
                handler(item?: unknown): void {
                    if (!item) {
                        return;
                    }
                    if (typeof item !== "string") {
                        return;
                    }
                    return setClassName(item);
                },
                once: false
            }),
            new EventBus.MessageSubscription({
                at: node,
                message: "push",
                handler(item?: unknown): void {
                    if (!item) {
                        return;
                    }
                    // @unsafe
                    return setMounted(components => [...components, (item as React.ReactNode)]);
                },
                once: false
            }),
            new EventBus.MessageSubscription({
                at: node,
                message: "pull",
                handler(): void {
                    return setMounted(components => components.splice(0, -1));
                },
                once: false
            }),
            new EventBus.MessageSubscription({
                at: node,
                message: "wipe",
                handler(): void {
                    return setMounted([]);
                },
                once: false
            }),
            new EventBus.MessageSubscription({
                at: node,
                message: "swap",
                handler(item?: unknown): void {
                    if (!item) {
                        return;
                    }
                    // @unsafe
                    return setMounted(components => [...components.slice(0, -1), (item as React.ReactNode)]);
                }
            })
        ];
        setTimeout(function() {
            if (!children) {
                return;
            }
            if (Array.isArray(children)) {
                let cooldown: number = 0;
                (children as (React.ReactNode | undefined)[]).forEach(child => {
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
        <ReactSpring.animated.div
        className={className}
        style={{
            ...ReactSpring.useSpring({from: spring[0], to: spring[1], config: springConfig}),
            ...style
        }}
        children={mounted}
        {...more}>
        </ReactSpring.animated.div>
    );
}