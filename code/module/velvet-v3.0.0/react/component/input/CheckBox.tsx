import type {CSSProperties} from "react";
import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import RemoteCol from "../remote/RemoteCol.tsx";
import {defaultEventsHub} from "../../../event/hub/DefaultEventsHub.ts";
import type {EventSubscription} from "fbemitter";

export function CheckBox({
    address,
    initialClassName,
    initialSpring,
    initialSpringConfig,
    initialStyle,
    childrenMountDelay,
    childrenMountCooldown,
    dotAddress,
    dotInitialClassName,
    dotInitialSpring,
    dotInitialSpringConfig,
    dotInitialStyle,
    dotColor,
    ...more}: {
        address: string;
        initialClassName?: string;
        initialSpring?: object;
        initialSpringConfig?: object;
        initialStyle?: CSSProperties;
        childrenMountDelay?: bigint;
        childrenMountCooldown?: bigint;
        dotColor?: string;
        [key: string]: any;}): React.JSX.Element {
    const {state, setState} = useState<bigint>(0n);
    useEffect(function() {
        const sub0: EventSubscription = defaultEventsHub.hook(address, "StateRenderRequest", function(state) {
            if (state == 1n) {
                defaultEventsHub.post(address, "SpringRenderRequest", {"opacity": "1"});
                setState(state);
                defaultEventsHub.post(address, "ToggledOn");
            }
            if (state == 0n) {
                defaultEventsHub.post(address, "SpringRenderRequest", {"opacity": "0"});
                setState(state);
                defaultEventsHub.post(address, "ToggledOff");
            }
        });
        return function() {
            sub0.remove();
            return;
        }
    }, []);
    return <RemoteCol {...{
        "address": address,
        "initialClassName": initialClassName,
        "initialSpring": initialSpring,
        "initialSpringConfig": initialSpringConfig,
        "initialStyle": {
            "width": "25px",
            "height": "25px",
            "borderWidth": "1px",
            "borderStyle": "solid",
            "borderColor": "#505050",
            ...initialStyle ?? {}
        },
        "childrenMountDelay": childrenMountDelay,
        "childrenMountCooldown": childrenMountCooldown,
        "children": [
            <RemoteCol {...{
                "address": dotAddress,
                "initialClassName": dotInitialClassName,
                "initialSpring": {
                    "opacity": "0",
                    ...dotInitialSpring
                },
                "initialStyle": {
                    "width": "50%",
                    "height": "50%",
                    "borderRadius": "50px",
                    "background": dotColor ?? "#A3A3A3",
                    "boxShadow": `0px 0px 16px 2px ${dotColor ?? "#A3A3A3"}`,
                    ...dotInitialStyle ?? {}
                },
                "onMouseEnter": () => defaultEventsHub.post(dotAddress, "SpringRenderRequest", {"cursor": "pointer"}),
                "onMouseLeave": () => defaultEventsHub.post(dotAddress, "SpringRenderRequest", {"cursor": "auto"}),
                "onClick": function() {
                    if (state == 0n) {
                        defaultEventsHub.post(dotAddress, "StateRenderRequest", 1n);
                    }
                    else {
                        defaultEventsHub.post(dotAddress, "StateRenderRequest", 0n);
                    }
                    return;
                }
            }}/>
        ],
        ...more
    }}/>;
}