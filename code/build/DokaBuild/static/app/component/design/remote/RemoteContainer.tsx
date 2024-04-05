import {stream} from "../../../core/Stream.tsx";
import React, {type CSSProperties, useEffect, useState} from "react";
import {type SpringProps} from "react-spring";
import Remote from "./Remote.tsx";
export default function RemoteContainer({tag, spring = {}, style = {}, direction = "column", delay = 0, cooldown = 0, children, ...more}: {tag: string; spring?: SpringProps; style?: CSSProperties; direction?: string; delay?: number; cooldown?: number; children?: JSX.Element | (JSX.Element)[] | (JSX.Element | undefined)[]; [key: string]: any;}) {
    style = {
        display: "flex",
        flexDirection: direction as any,
        justifyContent: "center",
        alignContent: "center",
        ...style
    };
    const [onScreen, setOnScreen] = useState([] as (JSX.Element)[]);
    const [pushed, setPushed] = useState([] as number[]);
    useEffect(function() {
        const pushBelowEvent = `${tag} pushBelow`;
        const pushAboveEvent = `${tag} pushAbove`;
        const pullBelowEvent = `${tag} pullBelow`;
        const pullAboveEvent = `${tag} pullAbove`;
        const wipeEvent = `${tag} wipe`;
        function handlePushBelowEvent(item: JSX.Element) {
            const items = onScreen;
            items.push(item);
            setOnScreen([...items]);
            console.log(...items);
        }
        function handlePushAboveEvent(item: JSX.Element) {}
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
        function handleWipeEvent() {
            const itemsLength = onScreen.length;
            for (let i = 0; i < itemsLength; i++) {
                const items = onScreen;
                items.pop();
                setOnScreen([...items]);
            }
        }
        stream.subscribe({event: pushBelowEvent, task: handlePushBelowEvent});
        stream.subscribe({event: pushAboveEvent, task: handlePushAboveEvent});
        stream.subscribe({event: pullBelowEvent, task: handlePullBelowEvent});
        stream.subscribe({event: pullAboveEvent, task: handlePullAboveEvent});
        stream.subscribe({event: wipeEvent, task: handleWipeEvent});
        setTimeout(function() {
            function hasBeenPushed(position: number) {
                return pushed.includes(position);
            }
            function markAsPushed(position: number) {
                const items = pushed;
                items.push(position);
                setPushed([...items]);
            }
            let childrenLength = children.length; /// -> This is fine.
            childrenLength = childrenLength ?? 1;
            let wait = cooldown;
            for (let i = 0; i < childrenLength; i++) {
                if (!hasBeenPushed(i)) {
                    let child = children[i]; /// -> This is fine.
                    child = child ?? children;
                    if (child) {
                        setTimeout(function() {
                            stream.post({event: `${tag} pushBelow`, data: child});
                        }, wait);
                        wait += cooldown;
                    }
                    markAsPushed(i);
                }
            }
        }, delay);
        function cleanup() {
            stream.wipe({event: pushBelowEvent});
            stream.wipe({event: pushAboveEvent});
            stream.wipe({event: pullBelowEvent});
            stream.wipe({event: pullAboveEvent});
            stream.wipe({event: wipeEvent});
        }
        return cleanup;
    }, []);
    return <Remote tag={tag} spring={spring} style={style} {...more} children={onScreen}/>
}