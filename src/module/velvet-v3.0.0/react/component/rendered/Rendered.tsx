import type {CSSProperties} from "react";
import type {SpringConfig} from "react-spring";
import type {EventSubscription} from "fbemitter";
import type {ComponentPropsWithoutRef} from "react";
import type {ReactNode} from "react";
import {animated} from "react-spring";
import {useSpring} from "react-spring";
import {config} from "react-spring";
import EventsHub from "../../../event/EventsHub.ts";
import UniqueTag from "../../../event/UniqueTag.ts";
import {useState} from "react";
import {useEffect} from "react";
import {post, hook} from "@toolkit";

export type RenderedProps = ComponentPropsWithoutRef<"div"> & {
    tag?: UniqueTag;
    spring?: CSSProperties;
    springConfig?: SpringConfig;
    mountDelay?: number;
    mountCooldown?: number;
};

export default function Renderedd(props: RenderedProps): ReactNode {
    const {tag, className: classNameProp, style: styleProp, spring: springProp, springConfig: springConfigProp, mountDelay, mountCooldown, children, ...more} = props;
    const [spring, setSpring] = useState<CSSProperties[]>([{}, springProp ?? {}]);
    const [style, setStyle] = useState<CSSProperties>(styleProp ?? {});
    const [className, setClassName] = useState<string>(classNameProp ?? "");
    const [onScreen, setOnScreen] = useState<ReactNode[]>([]);
    useEffect(function() {
        const subscriptions: EventSubscription[] = [
            EventsHub.hook(tag, "setSpring", (spring: CSSProperties) => setSpring(oldSpring => [oldSpring[1], {...oldSpring[1], ...spring ?? {}}])),
            EventsHub.hook(tag, "setStyle", (style: CSSProperties) => setStyle(oldStyle => ({...oldStyle, ...style ?? {}}))),
            EventsHub.hook(tag, "setClassName", (className: string) => setClassName(className)),
            EventsHub.hook(tag, "push", function(component: ReactNode) {
                const components: ReactNode[] = onScreen;
                components.push(component);
                setOnScreen([...components]);
                return;
            }),
            EventsHub.hook(tag, "pull", function() {
                const components: ReactNode[] = onScreen;
                components.pop();
                setOnScreen([...components]);
                return;
            }),
            EventsHub.hook(tag, "wipe", function() {
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
            EventsHub.hook(tag, "swap", function(component: ReactNode) {
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
                        cooldown += mountCooldown ?? 0;
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
        }, mountDelay);
        return function() {
            return subscriptions.forEach(subscription => subscription.remove());
        }
    }, []);
    return <animated.div {...{
        className: className,
        style: {
            ...useSpring({
                from: spring[0],
                to: spring[1],
                config: springConfigProp ?? config.default
            }),
            ...style
        },
        children: onScreen,
        ...more
    }}/>;
}