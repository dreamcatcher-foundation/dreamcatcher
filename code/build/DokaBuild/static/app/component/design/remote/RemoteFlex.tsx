import {stream} from "../../../core/Stream.tsx";
import Remote, {type RemoteProps} from "./2.tsx";
import React, {useEffect, useState} from "react";

interface RemoteFlexIntroAndOutroProps {
    introAnimationClassName?: string;
    outroAnimationClassName?: string;
    remoteTags?: string[];
}

interface RemoteFlexPopProps {
    delay?: number;
    cooldown?: number;
}

export interface RemoteFlexProps extends RemoteProps {
    width: string;
    height: string;
    delay?: number;
    cooldown?: number;
    flexDirection: string;
    childrenNames?: string[];
    introAnimation?: string;
    outroAnimation?: string;

}

export default function RemoteFlex(props: RemoteFlexProps) {
    let {name, spring, style, children, className} = props;
    let {width, height} = props;
    let {delay, cooldown} = props;
    let {flexDirection} = props;
    let {...other} = props;

    delay = delay ?? 0;
    cooldown = cooldown ?? 0;
    const remoteSpring = {
        width: width,
        height: height,
        ...spring
    };
    const remoteStyle = {
        display: "flex",
        flexDirection: flexDirection,
        justifyContent: "center",
        alignItems: "center",
        ...style
    };
    const [onScreen, setOnScreen] = useState([] as (JSX.Element)[]);
    const [done, setDone] = useState([] as number[]);
    useEffect(function() {
        stream.subscribe({
            event: `${name} pushBelow`,
            task: function(item: JSX.Element) {
                const items = onScreen;
                items.push(item);
                setOnScreen([...items]);
            }
        });
        
        stream.subscribe({
            event: `${name} pushAboveLastItem`,
            task: function(item: JSX.Element) {
                const items = onScreen;
                const itemsLength = items.length;
                const lastIndex = itemsLength - 1;
                const lastItem = items[lastIndex];
                items[lastIndex] = item;
                items.push(lastItem);
                setOnScreen([...items]);
            }
        });

        stream.subscribe({
            event: `${name} pushAbove`,
            task: function(item: JSX.Element) {
                const items = onScreen;
                let copy = [] as (JSX.Element)[];
                copy.push(item);
                copy = copy.concat(items);
                setOnScreen([...copy]);
            }
        });

        stream.subscribe({
            event: `${name} pushBetween`,
            task: function(item: JSX.Element, position: number) {
                const items = onScreen;
                const copy = [] as (JSX.Element)[];
                for (let i = 0; i < position; i++) {
                    const copied = items[i];
                    copy.push(copied);
                }
                copy.push(item);
                const itemsLength = items.length;
                for (let i = position; i < itemsLength; i++) {
                    const copied = items[i];
                    copy.push(copied);
                }
                setOnScreen(copy);
            }
        });

        stream.subscribe({
            event: `${name} pullBelow`,
            task: function() {
                const items = onScreen;
                items.pop();
                setOnScreen([...items]);
            }
        });

        stream.subscribe({
            event: `${name} pullAbove`,
            task: function() {
                const items = onScreen;
                items.shift();
                setOnScreen([...items]);
            }
        });

        stream.subscribe({
            event: `${name} pull`,
            task: function(position: number) {
                const items = onScreen;
                items.splice(position, 1);
                setOnScreen([...items]);
            }
        });

        stream.subscribe({
            event: `${name} wipe`,
            task: function() {
                const itemsLength = onScreen.length;
                for (let i = 0; i < itemsLength; i++) {
                    const items = onScreen;
                    items.pop();
                    setOnScreen([...items]); 
                }
            }
        });

        if (children) { // I know its cheese but now things are only spawned once
                        // I was having problems with duplicate posts.
            setTimeout(function() {
                const childrenLength = (children as any).length;
                let wait = cooldown;
                for (let i = 0; i < childrenLength; i++) {
                    let alreadyDone = done;
                    if (!alreadyDone.includes(i)) {
                        const child = (children as any)[i] as JSX.Element;
                        setTimeout(function() {
                            stream.post({event: `${name} pushBelow`, data: child});
                        }, wait);
                        wait += cooldown!;
                        alreadyDone.push(i);
                        setDone([...alreadyDone]);               
                    }
                }
            }, delay);
        }
        
        return function() {
            stream.wipe({event: `${name} pushBelow`});
            stream.wipe({event: `${name} pushAboveLastItem`});
            stream.wipe({event: `${name} pushAbove`});
            stream.wipe({event: `${name} pushBetween`});
            stream.wipe({event: `${name} pullBelow`});
            stream.wipe({event: `${name} pullAbove`});
            stream.wipe({event: `${name} pull`});
            stream.wipe({event: `${name} wipe`});
        }
    }, []);

    return <Remote name={name} spring={remoteSpring} style={remoteStyle as any} children={onScreen} {...other}/>
}