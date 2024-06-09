import React, {type ReactNode, type ComponentPropsWithoutRef, type CSSProperties, useState, useEffect} from "react";
import {type SpringConfig, animated, useSpring, config} from "react-spring";
import {SyncValue} from "../../../../toolkit/event-drive-architecture/SyncValue.ts";
import {type EventSubscription} from "fbemitter";


const text: SyncValue<string> = SyncValue("someText");

text.resync((v) => console.log(v));



type AnimatableProps = {
    spring: 
}

function Animatable() {

}


type SyncProps = {
    className?: string | SyncValue<string>;
    style?: CSSProperties | SyncValue<CSSProperties>;
};

function Sync(props: SyncProps): ReactNode {
    const {className: classNameProp, style: styleProp} = props;
    const [className, setClassName] = useState<string>("");
    const [style, setStyle] = useState<CSSProperties>({});
    const [springState, setSpringState] = useState<CSSProperties[]>([{}, spring?.get() ?? {}]);
    const [springConfigState, setSpringConfigState] = useState<SpringConfig>(springConfig?.get() ?? {});
    const [mountDelayState, setMountDelayState] = useState<bigint>(mountDelay?.get() ?? 0n);
    const [mountCooldownState, setMountCooldownState] = useState<bigint>(mountCooldown?.get() ?? 0n);
    const [childrenState, setChildrenState] = useState<ReactNode[]>([]);
    useEffect(function() {
        const subscriptions: EventSubscription[] = [];
        if (classNameProp && typeof classNameProp != "string") {
            subscriptions.push(classNameProp.resync((newClassName: string) => setClassName(newClassName)));
        }
        if (styleProp && typeof styleProp != typeof CSSProperties) {
            subscriptions.push(styleProp.resync((newStyle: CSSProperties) => setStyle({...style, ...newStyle})));
        }

        return function() {
            return subscriptions.forEach((subscription) => subscription.remove());
        }
    }, []);
    return <animated.div></animated.div>
}