import RemoteCol, {type IRemoteColProps} from "./RemoteCol.tsx";
import RemoteRow, {type IRemoteRowProps} from "./RemoteRow.tsx";
import Remote, {broadcast, once} from "./Remote.tsx";
import React, {useState, useEffect} from "react";

export type TShiftable = {
    component: JSX.Element;
    name: string;
};

export type TBuild = {
    components: TShiftable[];
    cooldown: number;
    parent: string;
    outroAnimation: string;
};

export interface IRemoteShifterProps extends IRemoteColProps, IRemoteRowProps {
    builds: TBuild[];
}

export function push(build: TBuild) {
    const components = build.components;
    const componentsLength = components.length;
    const cooldown = build.cooldown;
    const parent = build.parent;
    let wait = 0;
    once(`${parent} from transition done`, function() {
        for (let i = 0; i < componentsLength; i++) {
            const shiftable = components[i];
            const name = shiftable.name;
            const component = shiftable.component;
            setTimeout(function() {
                broadcast(`${parent} pushBelow`, component);
            }, wait);
            wait += cooldown;
        }
        setTimeout(function() {
            broadcast(`${parent} to transition done`);
        }, wait);    
    });
}

export function pull(build: TBuild) {
    const components = build.components;
    const componentsLength = components.length;
    const cooldown = build.cooldown;
    const parent = build.parent;
    const outroAnimation = build.outroAnimation;
    let wait = 0;
    for (let i = 0; i < componentsLength; i++) {
        const shiftable = components[i];
        const name = shiftable.name;
        const component = shiftable.component;
        setTimeout(function() {
            broadcast(`${name} setClassName`, outroAnimation);
        }, wait);
        wait += cooldown;
    }
    setTimeout(function() {
        broadcast(`${parent} wipe`);
        broadcast(`${parent} from transition done`);
    }, wait);
}

export default function RemoteShifter(props: IRemoteShifterProps) {
    const name = props.name;
    const width = props.width;
    const height = props.height;
    const builds = props.builds;
    const [state, setState] = useState([0, 0]);
    useEffect(function() {
        const fromState = state[0];
        const toState = state[1];
        const fromBuild = builds[fromState];
        const toBuild = builds[toState];
        push(toBuild);
        pull(fromBuild);
    }, [state]);
    return (
        <RemoteCol name={name} width={width} height={height}/>
    );
}