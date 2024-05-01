import React, {type ReactNode, useState, useEffect} from "react";
import Col from "../layout/Col.tsx";
import {defaultMappedEventEmitter} from "../../lib/messenger/DefaultMappedEventEmitter.ts";
import {type EventSubscription} from "fbemitter";

export type CheckBoxProps = {
    name: string,
    color: string,
    size: number,
    isToggled: boolean
};

export default function CheckBox(props: CheckBoxProps): ReactNode {
    const {name, color, size: pSize, isToggled: pIsToggled} = props;
    const [isToggled, toggle] = useState<boolean>(pIsToggled);
    const size: string = `${pSize}px`;
    const dotName: string = `${name}__dot`;
    useEffect(function() {
        const subscription: EventSubscription = defaultMappedEventEmitter.hook(name, "toggle", function(state: boolean) {
            toggle(state);
            if (isToggled) {
                defaultMappedEventEmitter.post(dotName, "setSpring", {opacity: "1"});
                defaultMappedEventEmitter.postEvent(name, "TOGGLED", state);
                return;
            }
            defaultMappedEventEmitter.post(dotName, "setSpring", {opacity: "0"});
            defaultMappedEventEmitter.postEvent(name, "TOGGLED", state);
            return;
        });
        return function() {
            return subscription.remove();
        }
    }, []);
    return (
        <Col {...{
            name: name,
            style: {
                width: size,
                height: size,
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: color
            },
            onMouseEnter: () => defaultMappedEventEmitter.post(name, "setSpring", {cursor: "pointer"}),
            onMouseLeave: () => defaultMappedEventEmitter.post(name, "setSpring", {cursor: "auto"}),
            onClick: function() {
                if (isToggled) {
                    toggle(false);
                    defaultMappedEventEmitter.post(dotName, "setSpring", {opacity: "1"});
                    defaultMappedEventEmitter.postEvent(name, "TOGGLED", false);
                    return;
                }
                toggle(true);
                defaultMappedEventEmitter.post(dotName, "setSpring", {opacity: "0"});
                defaultMappedEventEmitter.postEvent(name, "TOGGLED", true);
                return;
            }
        }}>
            <Col {...{
                name: dotName,
                spring: {
                    opacity: pIsToggled ? "1" : "0"
                },
                style: {
                    width: "50%",
                    height: "50%",
                    borderRadius: "50px",
                    background: color,
                    boxShadow: `0px 0px 16px 2px ${color}`
                }
            }}>
            </Col>
        </Col>
    );
}